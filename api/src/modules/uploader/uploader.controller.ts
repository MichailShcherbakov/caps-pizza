import * as multer from "multer";
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

export class File {
  filename: string;
  url: string;
  full_url: string;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __APP_IMAGES_LOCATION_PATH__);
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1].split("+")[0];
    const uniqueSuffix = Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}.${ext}`);
  },
});

@Controller()
export class UploaderController {
  @Post("/upload")
  @UseInterceptors(FileInterceptor("file", { storage }))
  uploadFile(@UploadedFile() file: Express.Multer.File): File {
    return {
      filename: file.filename,
      url: `${__APP_IMAGES_LOCATION_URL__}/${file.filename}`,
      full_url: `${__APP_IMAGES_LOCATION_FULL_URL__}/${file.filename}`,
    };
  }
}

export default UploaderController;
