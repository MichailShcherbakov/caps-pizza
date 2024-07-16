import { Exclude } from "class-transformer";
import { Column, Entity } from "typeorm";
import IEntity from "./entity.interface";

@Entity("users")
export class UserEntity extends IEntity {
  @Column({ unique: true })
  name: string;

  @Exclude()
  @Column()
  password_hash: string;

  @Exclude()
  @Column()
  salt: string;
}

export default UserEntity;
