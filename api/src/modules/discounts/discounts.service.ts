import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import DiscountEntity, {
  DiscountTypeEnum,
} from "~/db/entities/discount.entity";
import { CreateDiscountDto } from "./discounts.dto";

@Injectable()
export default class DiscountsService {
  constructor(
    @InjectRepository(DiscountEntity)
    private discountRepository: Repository<DiscountEntity>
  ) {}

  find(
    options: FindOptionsWhere<DiscountEntity> = {}
  ): Promise<DiscountEntity[]> {
    return this.discountRepository.find({
      where: options,
      relations: {
        products: true,
        product_categories: true,
      },
      order: {
        name: "ASC",
      },
    });
  }

  findOne(
    options: FindOptionsWhere<DiscountEntity> = {}
  ): Promise<DiscountEntity | null> {
    return this.discountRepository.findOne({
      where: options,
      relations: {
        products: true,
        product_categories: true,
      },
    });
  }

  async create(dto: CreateDiscountDto): Promise<DiscountEntity> {
    const foundDiscount = await this.findOne({ name: dto.name });

    if (foundDiscount)
      throw new BadRequestException(
        `The discount ${foundDiscount.uuid} already has the ${dto.name} name`
      );

    if (dto.type === DiscountTypeEnum.PERCENT && dto.value > 100)
      throw new BadRequestException(
        `The discount cannot has the value greater then 100 when it has ${DiscountTypeEnum.PERCENT} type`
      );

    const e = new DiscountEntity();
    e.name = dto.name;
    e.type = dto.type;
    e.scope = dto.scope;
    e.condition = dto.condition;
    e.value = dto.value;

    return this.discountRepository.save(e);
  }

  async delete(uuid: string): Promise<void> {
    const foundDiscount = await this.findOne({ uuid });

    if (!foundDiscount)
      throw new NotFoundException(`The discount ${uuid} does not exist`);

    await this.discountRepository.delete({ uuid });
  }
}
