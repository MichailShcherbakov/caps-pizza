import { Module } from "@nestjs/common";
import UploaderController from "./uploader.controller";
import UploaderService from "./uploader.service";

@Module({
  controllers: [UploaderController],
  providers: [UploaderService],
})
export class UploaderModule {}

export default UploaderModule;
