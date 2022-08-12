import { Exclude } from "class-transformer";
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export default abstract class IEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}
