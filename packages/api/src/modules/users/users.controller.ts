import { Controller, Get } from "@nestjs/common";
import UserEntity from "~/db/entities/user.entity";
import AuthGuard from "../auth/auth.guard";
import UsersService from "./users.service";

@Controller()
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @AuthGuard()
  @Get("/users")
  getUsers(): Promise<UserEntity[]> {
    return this.usersService.find();
  }
}
