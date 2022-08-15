import {
  DeliveryCriteriaEnum,
  DeliveryOperatorEnum,
  DeliveryTypeEnum,
} from "~/services/delivery.service";

export const locale = {
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
