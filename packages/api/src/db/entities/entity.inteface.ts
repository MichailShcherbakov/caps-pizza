import { Exclude } from "class-transformer";
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { IEntity as EntityInterface } from "@monorepo/common";

export default abstract class IEntity implements EntityInterface {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}
