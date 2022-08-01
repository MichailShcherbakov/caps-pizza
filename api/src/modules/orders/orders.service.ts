import { HttpService } from "@nestjs/axios";
import { Injectable, NotFoundException } from "@nestjs/common";
import { In } from "typeorm";
import ModifiersService from "../modifiers/modifiers.service";
import ProductsService from "../products/products.service";
import {
  FrontPadPayload,
  FrontPadResponse,
  MakeAnOrderDto,
} from "./orders.dto";

export const FIXED_MODIFIER_COUNT = 1;

@Injectable()
export default class OrdersService {
  constructor(
    private readonly httpSevice: HttpService,
    private readonly productsService: ProductsService,
    private readonly modifiersService: ModifiersService
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

    const productArticleNumbers: Record<number, number> = {};
    const productCount: Record<number, number> = {};
    const productPrice: Record<number, number> = {};
    const productModifiers: Record<number, number> = {};

    for (const product of dto.products) {
      const foundProduct = products.find(p => p.uuid === product.uuid);

      if (!foundProduct)
        throw new NotFoundException(
          `The product ${product.uuid} does not found`
        );

      const productIndex = Object.keys(productArticleNumbers).length;

      productArticleNumbers[productIndex] = foundProduct.article_number;
      productPrice[productIndex] = foundProduct.price;
      productCount[productIndex] = product.count;

      for (const modifier of product.modifiers) {
        const foundModifier = modifiers.find(m => m.uuid === modifier.uuid);

        if (!foundModifier)
          throw new NotFoundException(
            `The modifier ${modifier.uuid} does not found`
          );

        const modifierIndex = Object.keys(productArticleNumbers).length;

        productArticleNumbers[modifierIndex] = foundModifier.article_number;
        productPrice[modifierIndex] = foundModifier.price;
        productCount[modifierIndex] = FIXED_MODIFIER_COUNT;
        productModifiers[modifierIndex] = productIndex;
      }
    }

    return this.sendToFrontPad({
      product: productArticleNumbers,
      product_kol: productCount,
      product_price: productPrice,
      product_mod: productModifiers,
      sale: 0,
      sale_amount: 0,
      street: dto.delivery_address.street,
      home: dto.delivery_address.house,
      pod: dto.delivery_address.entrance,
      et: dto.delivery_address.floor,
      apart: dto.delivery_address.apartment,
      name: dto.client_info.name,
      phone: dto.client_info.phone,
      mail: dto.client_info.mail,
      descr: dto.description,
      tags: [],
    });
  }

  async sendToFrontPad(payload: FrontPadPayload): Promise<FrontPadResponse> {
    return this.httpSevice.axiosRef.request({
      method: "post",
      url: "https://app.frontpad.ru/api/index.php?new_order",
      headers: {
        "Content-Type": `multipart/form-data`,
      },
      data: {
        secret: process.env.SECRET,
        ...payload,
      },
    });
  }
}
