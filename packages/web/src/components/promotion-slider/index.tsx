import { Stack } from "@mui/material";
import NextImage from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper";
import { useGetPromotionsQuery } from "~/services/promotions.service";
import { useStyle } from "./index.style";
import { useMediaQuery } from "~/ui";

import "swiper/css";
import "swiper/css/a11y";
import "swiper/css/navigation";
import Section from "../sections/section";
import Title from "../title";

export interface PromotionSliderProps {}

export const PromotionSlider: React.FC<PromotionSliderProps> = () => {
  const { classes } = useStyle();
  const match = useMediaQuery(theme => theme.breakpoints.down("md"));
  const { data: promotions = [] } = useGetPromotionsQuery();

  return (
    <Section id="Акции" className={classes.section}>
      <Title text="Акции" />
      <Swiper
        slidesPerView={match ? "auto" : 3}
        spaceBetween={32}
        modules={[Navigation, A11y]}
        navigation
        className={classes.root}
      >
        {promotions
          .filter(p => p.display)
          .sort((a, b) => a.display_position - b.display_position)
          .map(promotion => (
            <SwiperSlide key={promotion.uuid}>
              <Stack className={classes.image}>
                <NextImage
                  src={`${process.env.NEXT_PUBLIC_IMAGES_SOURCE_URL}${promotion.image_url}`}
                  alt={promotion.name}
                  layout="fill"
                  priority
                />
              </Stack>
            </SwiperSlide>
          ))}
      </Swiper>
    </Section>
  );
};

export default PromotionSlider;
