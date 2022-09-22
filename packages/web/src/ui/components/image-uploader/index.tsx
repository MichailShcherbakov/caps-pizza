import React from "react";
import { Button, Stack, Tooltip } from "@mui/material";
import { useStyle } from "./index.style";
import ImageIcon from "@mui/icons-material/Image";
import ExternalImage from "~/components/external-image";
import Image from "../image";

export interface ImageUploaderProps {
  image?: File;
  imageURL?: string;
  imageWidth: number;
  imageHeight: number;
  touched?: boolean;
  errors?: string;
  onChange?: (data: { image: File; imageURL: string }) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = React.memo(
  ({ image, imageURL, imageWidth, imageHeight, touched, errors, onChange }) => {
    const { classes } = useStyle();

    return (
      <Tooltip
        title="Загрузите изображение"
        open={Boolean(touched) && Boolean(errors)}
        disableFocusListener
        disableHoverListener
        disableTouchListener
      >
        <Button
          aria-label="upload picture"
          component="label"
          variant={imageURL ? "text" : "outlined"}
          color="neutral"
          className={classes.btn}
        >
          <input
            hidden
            id="image"
            name="image"
            accept="image/jpeg,image/x-png"
            type="file"
            onChange={e => {
              if (!e.currentTarget?.files?.length) return;

              const image = e.currentTarget.files[0];

              onChange &&
                onChange({
                  image,
                  imageURL: URL.createObjectURL(image),
                });
            }}
          />
          {imageURL ? (
            image ? (
              <Image
                url={imageURL}
                alt="uploaded image"
                imageWidth={imageWidth}
                imageHeight={imageHeight}
              />
            ) : (
              <ExternalImage
                url={imageURL}
                alt="uploaded image"
                imageWidth={imageWidth}
                imageHeight={imageHeight}
              />
            )
          ) : (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                width: imageWidth,
                height: imageHeight,
              }}
            >
              <ImageIcon />
            </Stack>
          )}
        </Button>
      </Tooltip>
    );
  }
);

ImageUploader.displayName = "ImageUploader";

export default ImageUploader;
