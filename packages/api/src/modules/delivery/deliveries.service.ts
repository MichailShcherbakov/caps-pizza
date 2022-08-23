import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import DeliveryEntity, {
  DeliveryOperatorEnum,
  DeliveryTypeEnum,
} from "~/db/entities/delivery.entity";
import SyncService from "../sync/sync.service";
import { CreateDeliveryDto, UpdateDeliveryDto } from "./deliveries.dto";
import deliveryModule from "@monorepo/common/modules/delivery";
import { IDelivery } from "@monorepo/common";

@Injectable()
export default class DeliveriesService {
  constructor(
    @InjectRepository(DeliveryEntity)
    private readonly deliveryRepository: Repository<DeliveryEntity>,
    @Inject(forwardRef(() => SyncService))
    private readonly syncService: SyncService
  ) {}

  static sort(deliveries: DeliveryEntity[]): DeliveryEntity[] {
    return deliveries.sort((a, b) => DeliveryEntity.compare(a, b));
  }

  find(options?: FindOptionsWhere<DeliveryEntity>): Promise<DeliveryEntity[]> {
    return this.deliveryRepository
      .find({ where: options })
      .then(deliveries => DeliveriesService.sort(deliveries));
  }

  findOne(
    options?: FindOptionsWhere<DeliveryEntity>
  ): Promise<DeliveryEntity | null> {
    return this.deliveryRepository.findOne({ where: options });
  }

  async findOneOrFail(
    options?: FindOptionsWhere<DeliveryEntity>
  ): Promise<DeliveryEntity> {
    const delivery = await this.findOne(options);

    if (!delivery)
      throw new NotFoundException(
        `The delivery ${options?.uuid} does not exist`
      );

    return delivery;
  }

  async create(dto: CreateDeliveryDto): Promise<DeliveryEntity> {
    const foundExistsDelivery = await this.findOne({
      name: dto.name,
    });

    if (foundExistsDelivery)
      throw new BadRequestException(
        `The delivery with '${dto.name}' name already exists`
      );

    if (dto.type === DeliveryTypeEnum.PERCENT && dto.value > 100)
      throw new BadRequestException(
        `The delivery cannot has the value greater then 100 when it has ${DeliveryTypeEnum.PERCENT} type`
      );

    if (
      dto.condition.op === DeliveryOperatorEnum.BETWEEN &&
      !dto.condition.value2
    )
      throw new BadRequestException(
        `The delivery has the ${DeliveryOperatorEnum.BETWEEN} condition operator, but the value2 was not provided`
      );

    await this.syncService.isArticleNumberAvailable(dto.article_number, true);

    const e = new DeliveryEntity();
    e.name = dto.name;
    e.article_number = dto.article_number;
    e.condition = dto.condition;
    e.type = dto.type;
    e.value = dto.value;

    return this.deliveryRepository.save(e);
  }

  async update(uuid: string, dto: UpdateDeliveryDto): Promise<DeliveryEntity> {
    const foundDelivery = await this.findOne({ uuid });

    if (!foundDelivery)
      throw new NotFoundException(`The delivery ${uuid} does not exist`);

    if (dto.name && foundDelivery.name !== dto.name) {
      const foundExistsDelivery = await this.findOne({ name: dto.name });

      if (foundExistsDelivery)
        throw new BadRequestException(
          `The delivery with '${dto.name}' name already exists`
        );
    }

    if (
      dto.type === DeliveryTypeEnum.PERCENT ||
      (dto.type === undefined &&
        foundDelivery.type === DeliveryTypeEnum.PERCENT)
    ) {
      if (
        (dto.value !== undefined && dto.value > 100) ||
        (dto.value === undefined && foundDelivery.value > 100)
      )
        throw new BadRequestException(
          `The delivery cannot has the value greater then 100 when it has ${DeliveryTypeEnum.PERCENT} type`
        );
    }

    if (
      dto.article_number &&
      dto.article_number !== foundDelivery.article_number
    ) {
      await this.syncService.isArticleNumberAvailable(dto.article_number, true);
    }

    if (
      dto.condition &&
      dto.condition.op === DeliveryOperatorEnum.BETWEEN &&
      !dto.condition.value2
    )
      throw new BadRequestException(
        `The delivery has the ${DeliveryOperatorEnum.BETWEEN} condition operator, but the value2 was not provided`
      );

    foundDelivery.name = dto.name ?? foundDelivery.name;
    foundDelivery.article_number =
      dto.article_number ?? foundDelivery.article_number;
    foundDelivery.condition = dto.condition ?? foundDelivery.condition;
    foundDelivery.type = dto.type ?? foundDelivery.type;
    foundDelivery.value = dto.value ?? foundDelivery.value;

    return this.deliveryRepository.save(foundDelivery);
  }

  async delete(uuid: string): Promise<void> {
    const foundDelivery = await this.findOne({ uuid });

    if (!foundDelivery)
      throw new NotFoundException(`The delivery ${uuid} does not exist`);

    await this.deliveryRepository.delete({ uuid });
  }

  async getAvailableDeliveries({
    orderedProductsCount,
    orderCost,
  }: {
    orderedProductsCount: number;
    orderCost: number;
  }): Promise<IDelivery[]> {
    const deliveries = await this.find();

    return deliveryModule.getAvailableDeliveries({
      deliveries,
      orderedProductsCount,
      orderCost,
    });
  }

  async isAvailableDelivery(
    delivery: IDelivery,
    {
      orderedProductsCount,
      orderCost,
    }: {
      orderedProductsCount: number;
      orderCost: number;
    }
  ): Promise<boolean> {
    const deliveries = await this.find();

    return deliveryModule.isAvailableDelivery(delivery, {
      deliveries,
      orderedProductsCount,
      orderCost,
    });
  }

  calculate(
    delivery: DeliveryEntity,
    { orderCost }: { orderCost: number }
  ): number {
    return deliveryModule.calculateDelivery({
      delivery,
      orderCost,
    });
  }
}
