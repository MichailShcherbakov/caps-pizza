import * as mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  _id: string;

  @Prop({ type: Number, required: true, unique: true })
  article_number: number;

  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String })
  desc?: string;

  @Prop({ type: String, required: true })
  imageURL: string;

  @Prop({ type: Date, default: () => new Date(Date.now()) })
  updated_at: Date;

  @Prop({ type: Date, default: () => new Date(Date.now()) })
  created_at: Date;

  @Prop({ type: Date })
  deleted_at?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
