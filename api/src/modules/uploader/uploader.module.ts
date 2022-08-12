import { Module } from "@nestjs/common";
import UploaderController from "./uploader.controller";

@Module({
  controllers: [UploaderController],
})
export class UploaderModule {}

export default UploaderModule;
