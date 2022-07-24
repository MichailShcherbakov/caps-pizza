import { Exclude } from "class-transformer";
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class IEntity {
  @PrimaryGeneratedColumn("uuid")
  public uuid: string;

  @Exclude()
  @CreateDateColumn()
  public created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  public updated_at: Date;
}

export default IEntity;
