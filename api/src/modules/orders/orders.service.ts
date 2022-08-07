import { HttpService } from "@nestjs/axios";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { In } from "typeorm";
import ModifiersService from "../modifiers/modifiers.service";
import ProductsService from "../products/products.service";
import { FrontPadResponse, MakeAnOrderDto } from "./orders.dto";
import * as FormData from "form-data";
import DiscountsService from "../discounts/discounts.service";

export const FIXED_MODIFIER_COUNT = 1;

@Injectable()
export default class OrdersService {
  constructor(
    private readonly httpSevice: HttpService,
    private readonly productsService: ProductsService,
    private readonly modifiersService: ModifiersService,
    private readonly discountsService: DiscountsService
  ) {}

  async makeAnOrder(dto: MakeAnOrderDto): Promise<FrontPadResponse> {
    const [products, modifiers] = await Promise.all([
      this.productsService.find({
        uuid: In(dto.products.map(p => p.uuid)),
      }),
      this.modifiersService.find({
        uuid: In(
          dto.products.reduce<string[]>((uuids, curr) => {
            uuids.push(...curr.modifiers.map(m => m.uuid));
            return uuids;
          }, [])
        ),
      }),
    ]);

    const payload: FormData = new FormData();
    let currentProductIndex = 0;

    for (const product of dto.products) {
      const foundProduct = products.find(p => p.uuid === product.uuid);

      if (!foundProduct)
        throw new NotFoundException(
          `The product ${product.uuid} does not found`
        );

      const productIndex = currentProductIndex++;

      payload.append(`product[${productIndex}]`, foundProduct.article_number);
      payload.append(`product_kol[${productIndex}]`, product.count);
      payload.append(`product_price[${productIndex}]`, foundProduct.price);

      for (const modifier of product.modifiers) {
        const foundModifier = modifiers.find(m => m.uuid === modifier.uuid);

        if (!foundModifier)
          throw new NotFoundException(
            `The modifier ${modifier.uuid} does not found`
          );

        const modifierIndex = currentProductIndex++;

        payload.append(
          `product[${modifierIndex}]`,
          foundModifier.article_number
        );
        payload.append(`product_kol[${modifierIndex}]`, FIXED_MODIFIER_COUNT);
        payload.append(`product_price[${modifierIndex}]`, foundModifier.price);
        payload.append(`product_mod[${modifierIndex}]`, productIndex);
      }
    }

    payload.append("sale", 0);
    payload.append("sale_amount", 0);
    payload.append("street", dto.delivery_address.street);
    payload.append("home", dto.delivery_address.house);
    payload.append("pod", dto.delivery_address.entrance);
    payload.append("et", dto.delivery_address.floor);
    payload.append("apart", dto.delivery_address.apartment);
    payload.append("name", dto.client_info.name);
    payload.append("phone", dto.client_info.phone);
    payload.append("mail", dto.client_info.mail || "");
    payload.append("descr", dto.description || "");

    return this.sendToFrontPad(payload);
  }

  async sendToFrontPad(payload: FormData): Promise<FrontPadResponse> {
    payload.append("secret", process.env.SECRET || "");

    const response = await this.httpSevice.axiosRef.request({
      method: "post",
      url: "https://app.frontpad.ru/api/index.php?new_order",
      headers: payload.getHeaders(),
      data: payload,
    });

    if (response.data.error) throw new BadRequestException(response.data.error);

    return response.data;
  }
}
