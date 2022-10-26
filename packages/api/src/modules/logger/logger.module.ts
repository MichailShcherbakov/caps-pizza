import { Logger, Module } from "@nestjs/common";
import { LoggerController } from "./logger.controller";

@Module({
  controllers: [LoggerController],
  providers: [Logger],
})
export class LoggerModule {}
