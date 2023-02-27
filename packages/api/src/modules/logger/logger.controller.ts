import { Controller, Post, Logger, Body } from "@nestjs/common";

@Controller("/")
export class LoggerController {
  constructor(private readonly logger: Logger) {}

  @Post("/logger")
  public log(@Body() body: Record<string, number | string> | number | string) {
    this.logger.error("Client Error", body, LoggerController.name);
  }
}
