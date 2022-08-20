import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
} from "~/services/discounts.service";

export const locale = {
  [DiscountScopeEnum.PRODUCTS]: "Товар/Товары",
  [DiscountScopeEnum.PRODUCT_FEATURES]: "Элементы товаров",
  [DiscountScopeEnum.GLOBAL]: "Заказ",
  [DiscountCriteriaEnum.COUNT]: "Количество",
  [DiscountCriteriaEnum.PRICE]: "Цена",
  [DiscountOperatorEnum.EQUAL]: "Равно",
  [DiscountOperatorEnum.LESS]: "Меньше",
  [DiscountOperatorEnum.GREATER]: "Больше",
  [DiscountOperatorEnum.BETWEEN]: "Между",
  [DiscountTypeEnum.PERCENT]: "Процент",
  [DiscountTypeEnum.IN_CASH]: "Фиксированное значение",
  [DiscountTypeEnum.FIXED_PRICE]: "Фиксированная стоимость",
};

export default locale;
