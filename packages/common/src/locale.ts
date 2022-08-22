import {
  ProductVolumeTypeEnum,
  ProductWeightTypeEnum,
} from "./interfaces/product.interface";
import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
} from "./interfaces/discount.interface";
import {
  DeliveryCriteriaEnum,
  DeliveryOperatorEnum,
  DeliveryTypeEnum,
} from "./interfaces/delivery.interface";

export const locale = {
  [ProductWeightTypeEnum.GRAMS]: "гр",
  [ProductWeightTypeEnum.LITERS]: "л",
  [ProductVolumeTypeEnum.DIAMETER]: "см",
  [ProductVolumeTypeEnum.QUANTITY]: "шт",
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
  [DeliveryCriteriaEnum.COUNT]: "Количество товаров в заказе",
  [DeliveryCriteriaEnum.PRICE]: "Сумма заказа",
  [DeliveryOperatorEnum.EQUAL]: "Равно",
  [DeliveryOperatorEnum.GREATER]: "Больше",
  [DeliveryOperatorEnum.LESS]: "Меньше",
  [DeliveryOperatorEnum.BETWEEN]: "Между",
  [DeliveryTypeEnum.IN_CASH]: "Фиксированная сумма",
  [DeliveryTypeEnum.PERCENT]: "Процент",
};

export default locale;
