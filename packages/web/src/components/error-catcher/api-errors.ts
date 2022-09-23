export type ErrorInfo = {
  type: string;
  desc: string | ((matches: string[] | undefined) => string);
  regex: RegExp;
  code: number;
};

export const API_ERRORS: ErrorInfo[] = [
  /* Product */
  /* Product Category */
  {
    type: "Нарушение валидации",
    desc: "Категория товаров с таким именем уже существует",
    regex: /^The product category with (.+) name already exists$/,
    code: 400,
  },
  /* Modifier */
  {
    type: "Нарушение валидации",
    desc: "Модификатор с таким именем уже существует",
    regex: /^The modifier with (.+) name in (.+) category already exists$/,
    code: 400,
  },
  /* Modifier Category */
  {
    type: "Нарушение валидации",
    desc: "Тип модификатора с таким именем уже существует",
    regex: /^The modifier category with '(.+)' name already exists$/,
    code: 400,
  },
  /* Discount */
  {
    type: "Нарушение валидации",
    desc: "Скидка с таким именем уже существует",
    regex: /^The discount (.+) already has the (.+) name$/,
    code: 400,
  },
  /* Delivery */
  {
    type: "Нарушение валидации",
    desc: "Доставка с таким именем уже существует",
    regex: /^The delivery with '(.+)' name already exists$/,
    code: 400,
  },
  /* Sync */
  {
    type: "Ошибка синхронизации",
    desc: "Товар с таким артиклем уже существует",
    regex: /^The product (.+) already has the article number$/,
    code: 400,
  },
  {
    type: "Ошибка синхронизации",
    desc: "Модификатор с таким артиклем уже существует",
    regex: /^The modifier (.+) already has the article number$/,
    code: 400,
  },
  {
    type: "Ошибка синхронизации",
    desc: "Доставка с таким артиклем уже существует",
    regex: /^The delivery (.+) already has the article number$/,
    code: 400,
  },
  {
    type: "Ошибка синхронизации",
    desc: "Артикль не найден",
    regex: /^Sync error. The article number not found$/,
    code: 400,
  },
  /* Client Errors */
  {
    type: "Нарушение валидации",
    desc: ([size] = [""]) => `Картинка товара не должна быть больше ${size} кб`,
    regex: /^The image size greater then (.+) kb$/,
    code: 1010,
  },
  {
    type: "Нарушение валидации",
    desc: "Артикль не найден",
    regex: /^The image not loaded$/,
    code: 1020,
  },
  /* Authorization  */
  {
    type: "Ошибка авторизации",
    desc: "Неверно указаны имя пользователя или пароль",
    regex: /^The authentication fails$/,
    code: 401,
  },
  {
    type: "Ошибка авторизации",
    desc: "Сессия завершена. Пройдите повторную аутентификацию",
    regex: /^The refresh token is expired$/,
    code: 401,
  },
  /* Order Validation  */
  {
    type: "Нарушение валидации",
    desc: "Неверно указан номер телефона",
    regex: /^client_info.phone must be a valid phone number$/,
    code: 400,
  },
  {
    type: "Нарушение валидации",
    desc: "Неверно указан адрес электронной почты",
    regex: /^client_info.email must be an email$/,
    code: 400,
  },
];

export default API_ERRORS;
