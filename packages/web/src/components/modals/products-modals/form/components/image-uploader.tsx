import { Button, Stack, Tooltip } from "@mui/material";
import React from "react";
import NextImage from "next/image";
import ImageIcon from "@mui/icons-material/Image";
import { useStyle } from "../../index.style";
import LoadingIcon from "~/assets/pizza-loading-2.svg";

export interface ImageUploaderProps {
  image?: File;
  imageURL?: string;
  touched?: boolean;
  errors?: string;
  onChange?: (data: { image: File; imageURL: string }) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = React.memo(
  ({ image, imageURL, touched, errors, onChange }) => {
    const [loading, setLoading] = React.useState<boolean>(true);
    const { classes } = useStyle({
      imageLoading: loading,
    });

    const onLoadingComplete = React.useCallback(() => {
      setLoading(false);
    }, []);

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
          <Stack className={classes.image}>
            {imageURL ? (
              <>
                {loading ? <LoadingIcon /> : undefined}
                <NextImage
                  src={
                    image
                      ? imageURL
                      : `${process.env.NEXT_PUBLIC_IMAGES_SOURCE_URL}${imageURL}`
                  }
                  alt="loaded image"
                  layout="fill"
                  onLoadingComplete={onLoadingComplete}
                />
              </>
            ) : (
              <ImageIcon />
            )}
          </Stack>
        </Button>
      </Tooltip>
    );
  }
);

ImageUploader.displayName = "ImageUploader";

export default ImageUploader;
