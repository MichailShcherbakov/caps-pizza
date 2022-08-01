import { HttpService } from "@nestjs/axios";
import { Injectable, Post } from "@nestjs/common";
import ProductsService from "../products/products.service";
import { MakeAnOrderDto } from "./order.dto";

@Injectable()
export default class OrderService {
  constructor(private readonly httpSevice: HttpService) {}

  @Post()
  async makeAnOrder(dto: MakeAnOrderDto): Promise<any> {
    const response = await this.httpSevice.axiosRef.request({
      method: "post",
      url: "https://app.frontpad.ru/api/index.php?new_order",
      headers: {
        "Content-Type": `multipart/form-data`,
      },
      data: {
        secret: process.env.SECRET,
      },
    });

    console.log(response.data);
  }
}
