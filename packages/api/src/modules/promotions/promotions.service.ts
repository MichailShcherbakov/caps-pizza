import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import PromotionEntity from "~/db/entities/promotion.entity";
import { CreatePromotionDto, UpdatePromotionDto } from "./promotions.dto";

@Injectable()
export default class PromotionsService {
  constructor(
    @InjectRepository(PromotionEntity)
    private readonly promotionsRepository: Repository<PromotionEntity>
  ) {}

  find(
    options?: FindOptionsWhere<PromotionEntity>
  ): Promise<PromotionEntity[]> {
    return this.promotionsRepository
      .find({
        where: options,
      })
      .then(promotions => PromotionsService.sort(promotions));
  }

  static sort(promotions: PromotionEntity[]): PromotionEntity[] {
    return promotions.sort((a, b) => PromotionEntity.compare(a, b));
  }

  findOne(
    options?: FindOptionsWhere<PromotionEntity>
  ): Promise<PromotionEntity | null> {
    return this.promotionsRepository.findOne({
      where: options,
    });
  }

  async findOneOrFail(
    options?: FindOptionsWhere<PromotionEntity>
  ): Promise<PromotionEntity> {
    const foundPromotion = await this.findOne(options);

    if (!foundPromotion)
      throw new NotFoundException(
        `The promotion ${options?.uuid ?? options?.name} does not exist`
      );

    return foundPromotion;
  }

  async create(dto: CreatePromotionDto): Promise<PromotionEntity> {
    const [foundNamePromotion, foundImageUrlPromotion] = await Promise.all([
      this.findOne({
        name: dto.name,
      }),
      this.findOne({
        image_url: dto.image_url,
      }),
    ]);

    if (foundNamePromotion)
      throw new BadRequestException(
        `The promotion with the ${dto.name} name already exists`
      );

    if (foundImageUrlPromotion)
      throw new BadRequestException(
        `The promotion with the ${dto.image_url} image already exists`
      );

    const e = new PromotionEntity();
    e.name = dto.name;
    e.image_url = dto.image_url;
    e.display = dto.display;
    e.display_position = dto.display_position;

    return this.promotionsRepository.save(e);
  }

  async update(
    uuid: string,
    dto: UpdatePromotionDto
  ): Promise<PromotionEntity> {
    const foundPromotion = await this.findOneOrFail({ uuid });

    if (dto.name && dto.name !== foundPromotion.name) {
      const foundNamePromotion = await this.findOne({
        name: dto.name,
      });

      if (foundNamePromotion)
        throw new BadRequestException(
          `The promotion with the ${dto.name} name already exists`
        );

      foundPromotion.name = dto.name;
    }

    if (dto.image_url && dto.image_url !== foundPromotion.image_url) {
      const foundImageUrlPromotion = await this.findOne({
        image_url: dto.image_url,
      });

      if (foundImageUrlPromotion)
        throw new BadRequestException(
          `The promotion with the ${dto.image_url} image already exists`
        );

      foundPromotion.image_url = dto.image_url;
    }

    foundPromotion.display = dto.display ?? foundPromotion.display;
    foundPromotion.display_position =
      dto.display_position ?? foundPromotion.display_position;

    return this.promotionsRepository.save(foundPromotion);
  }

  async delete(uuid: string): Promise<void> {
    await this.findOneOrFail({ uuid });

    await this.promotionsRepository.delete({ uuid });
  }
}
