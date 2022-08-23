import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import PaymentEntity from "~/db/entities/payment.entity";
import { CreatePaymentDto, UpdatePaymentDto } from "./orders.dto";

@Injectable()
export default class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>
  ) {}

  find(options?: FindOptionsWhere<PaymentEntity>): Promise<PaymentEntity[]> {
    return this.paymentRepository
      .find({
        where: options,
      })
      .then(payments => PaymentService.sort(payments));
  }

  static sort(payments: PaymentEntity[]): PaymentEntity[] {
    return payments.sort((a, b) => PaymentEntity.compare(a, b));
  }

  findOne(
    options?: FindOptionsWhere<PaymentEntity>
  ): Promise<PaymentEntity | null> {
    return this.paymentRepository.findOne({ where: options });
  }

  async findOneOrFail(
    options?: FindOptionsWhere<PaymentEntity>
  ): Promise<PaymentEntity> {
    const foundPayment = await this.findOne(options);

    if (!foundPayment) {
      throw new NotFoundException(
        `The payment ${
          options?.uuid ?? options?.name ?? options?.code
        } does not exist`
      );
    }

    return foundPayment;
  }

  async create(dto: CreatePaymentDto): Promise<PaymentEntity> {
    const [foundExistsNamePayment, foundExistsCodePayment] = await Promise.all([
      this.findOne({ name: dto.name }),
      this.findOne({ code: dto.code }),
    ]);

    if (foundExistsNamePayment) {
      throw new BadRequestException(
        `The payment with the ${dto.name} name already exists`
      );
    }

    if (foundExistsCodePayment) {
      throw new BadRequestException(
        `The payment with the ${dto.code} code already exists`
      );
    }

    const payment = new PaymentEntity();
    payment.name = dto.name;
    payment.code = dto.code;

    return this.paymentRepository.save(payment);
  }

  async update(uuid: string, dto: UpdatePaymentDto): Promise<PaymentEntity> {
    const foundPayment = await this.findOneOrFail({ uuid });

    if (dto.name) {
      const foundExistsNamePayment = await this.findOne({ name: dto.name });

      if (foundExistsNamePayment) {
        throw new BadRequestException(
          `The payment with the ${dto.name} name already exists`
        );
      }

      foundPayment.name = dto.name;
    }

    if (dto.code) {
      const foundExistsCodePayment = await this.findOne({ code: dto.code });

      if (foundExistsCodePayment) {
        throw new BadRequestException(
          `The payment with the ${dto.code} code already exists`
        );
      }

      foundPayment.code = dto.code;
    }

    return this.paymentRepository.save(foundPayment);
  }

  async delete(uuid: string): Promise<void> {
    await this.findOneOrFail({ uuid });
    await this.paymentRepository.delete({ uuid });
  }
}
