import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import DiscountEntity from "~/db/entities/discount.entity";
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
    return this.discountRepository.find({ where: options });
  }

  findOne(
    options: FindOptionsWhere<DiscountEntity> = {}
  ): Promise<DiscountEntity | null> {
    return this.discountRepository.findOne({ where: options });
  }

  create(dto: CreateDiscountDto): Promise<DiscountEntity> {
    const newDiscount = new DiscountEntity();
    newDiscount.name = dto.name;
    newDiscount.type = dto.type;
    newDiscount.scope = dto.scope;
    newDiscount.condition = dto.condition;
    newDiscount.value = dto.value;

    return this.discountRepository.save(newDiscount);
  }

  async delete(uuid: string): Promise<void> {
    const foundDiscount = await this.findOne({ uuid });

    if (!foundDiscount)
      throw new NotFoundException(`The discount ${uuid} does not exist`);

    await this.discountRepository.delete({ uuid });
  }
}
