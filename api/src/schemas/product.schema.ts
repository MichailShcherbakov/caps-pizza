import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as uuid from "uuid";

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ default: () => uuid.v4() })
  uuid: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  desc?: string;

  @Prop({ required: true })
  imageURL: string;

  @Prop({ type: Date, default: () => new Date(Date.now()) })
  updated_at: Date;

  @Prop({ type: Date, default: () => new Date(Date.now()) })
  created_at: Date;

  @Prop({ type: Date })
  deleted_at?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
