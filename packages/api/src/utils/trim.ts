import { Transform, TransformFnParams } from "class-transformer";

export const Trim = () =>
  Transform(({ value }: TransformFnParams) =>
    typeof value === "string" ? value.trim() : value
  );
