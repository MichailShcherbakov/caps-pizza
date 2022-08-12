import { HttpService } from "@nestjs/axios";
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import * as FormData from "form-data";
import DeliveryService from "../delivery/deliveries.service";
import ModifiersService from "../modifiers/modifiers.service";
import ProductsService from "../products/products.service";

@Injectable()
export default class SyncService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
    @Inject(forwardRef(() => ModifiersService))
    private readonly modifiersService: ModifiersService,
    @Inject(forwardRef(() => DeliveryService))
    private readonly deliveryService: DeliveryService
  ) {}

  async isArticleNumberAvaliable(
    articleNumber: number,
    throwError?: boolean
  ): Promise<boolean> {
    const [product, modifier, delivery] = await Promise.all([
      this.productsService.findOne({ article_number: articleNumber }),
      this.modifiersService.findOne({ article_number: articleNumber }),
      this.deliveryService.findOne({ article_number: articleNumber }),
    ]);

    if (product)
      if (throwError)
        throw new BadRequestException(
          `The product ${product.uuid} already has the article number`
        );
      else return false;

    if (modifier)
      if (throwError)
        throw new BadRequestException(
          `The modifier ${modifier.uuid} already has the article number`
        );
      else return false;

    if (delivery)
      if (throwError)
        throw new BadRequestException(
          `The delivery ${delivery.uuid} already has the article number`
        );
      else return false;

    if (__DEV__ && !__SYNC_ON__) return true;

    const syncResult = await this.syncWithFrontPad(articleNumber);

    if (!syncResult && throwError)
      throw new BadRequestException(`Sync error. The article number not found`);

    return syncResult;
  }

  async syncWithFrontPad(articleNumber: number): Promise<boolean> {
    const payload = new FormData();
    payload.append("secret", __SECRET__ ?? "");

    const response = await this.httpService.axiosRef.request({
      method: "post",
      url: "https://app.frontpad.ru/api/index.php?get_products",
      headers: payload.getHeaders(),
      data: payload,
    });

    if (response.data.error) throw new BadRequestException(response.data.error);

    return (response.data.product_id as string[]).some(
      id => articleNumber.toString() === id
    );
  }
}
