import { Repository } from "typeorm";
import DiscountEntity from "~/db/entities/discount.entity";
import ModifiersService from "~/modules/modifiers/modifiers.service";
import ProductCategoriesService from "~/modules/products/modules/categories/categories.service";
import ProductsService from "~/modules/products/products.service";
import DiscountsService from "../../discounts.service";

export const discountRepositoryWrapper: Repository<DiscountEntity> = {} as any;
export const productCategoriesServiceWrapper: ProductCategoriesService =
  {} as any;
export const productsServiceWrapper: ProductsService = {
  find: jest.fn(),
} as any;
export const modifiersServiceWrapper: ModifiersService = {
  find: jest.fn(),
} as any;

export const discountsServiceWrapper = new DiscountsService(
  discountRepositoryWrapper,
  productsServiceWrapper,
  productCategoriesServiceWrapper,
  modifiersServiceWrapper
);

discountsServiceWrapper.find = jest.fn();
