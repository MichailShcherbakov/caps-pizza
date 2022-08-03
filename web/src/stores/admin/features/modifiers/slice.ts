import { createSlice } from "@reduxjs/toolkit";

export interface Modifier {
  uuid: string;
  name: string;
  desc?: string;
  article_number: number;
  image_url?: string;
  price: number;
  category_uuid: string;
}
