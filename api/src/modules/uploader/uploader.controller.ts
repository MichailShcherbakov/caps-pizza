import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { APP_ROOT_PATH } from "~/config";

export class File {
  filename: string;
  url: string;
}

@Controller()
export class UploaderController {
  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", { dest: APP_ROOT_PATH + "/static/images" })
  )
  uploadFile(@UploadedFile() file: Express.Multer.File): File {
    console.log(file);

    return {
      filename: file.filename,
      url: `/images/${file.filename}`,
    };
  }
}

export default UploaderController;
