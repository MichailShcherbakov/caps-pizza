import { Controller, Post, Logger, Body } from "@nestjs/common";

@Controller("/")
export class LoggerController {
  constructor(private readonly logger: Logger) {}

  @Post("/logger")
  public log(@Body() body: any) {
    this.logger.error("Client Error", body, LoggerController.name);
  }
}
