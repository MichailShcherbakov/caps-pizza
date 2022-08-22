import { Product } from "~/services/products.service";

function setValue<T>(
  array: Record<string, T[]>,
  key: string,
  value: T[]
): void {
  if (array[key] === undefined) {
    array[key] = value;
  } else {
    array[key].push(...value);
  }
}

export const sortByTags = (
  products: Product[]
): [string[], Record<string, Product[]>] => {
  const taggedProducts: Map<string, Product[]> = products.reduce(
    (tags, product) => {
      const productTags = product.tags?.length ? product.tags : [""];

      for (const tag of productTags) {
        const existsProducts = tags.get(tag);

        if (existsProducts) {
          existsProducts.push(product);
        } else {
          tags.set(tag, [product]);
        }
      }

      return tags;
    },
    new Map<string, Product[]>()
  );

  const sortedProductTags: string[] = Array.from(taggedProducts.keys()).sort(
    (a, b) => {
      const aTagEntries = new RegExp(`^(.+):([0-9]+)$`).exec(a);
      const aTagIndex: number | undefined = aTagEntries
        ? Number.parseInt(aTagEntries[2])
        : undefined;

      const bTagEntries = new RegExp(`^(.+):([0-9]+)$`).exec(b);
      const bTagIndex: number | undefined = bTagEntries
        ? Number.parseInt(bTagEntries[2])
        : undefined;

      if (Number.isInteger(aTagIndex) && !Number.isInteger(bTagIndex))
        return -1;
      else if (!Number.isInteger(aTagIndex) && Number.isInteger(bTagIndex))
        return 1;
      else if (
        aTagIndex === undefined ||
        bTagIndex === undefined ||
        !Number.isInteger(aTagIndex) ||
        !Number.isInteger(bTagIndex)
      )
        return 0;
      else return aTagIndex - bTagIndex;
    }
  );

  const reducedTaggedProducts: Record<string, Product[]> = {};
  const reducedTags: string[] = sortedProductTags.filter(tag => {
    const tagEntries = new RegExp(`^(.+):([0-9]+)$`).exec(tag);
    return tagEntries || !tag.length;
  });

  for (const tag of sortedProductTags) {
    const products = taggedProducts.get(tag) as Product[];

    const tagEntries = new RegExp(`^(.+):([0-9]+)$`).exec(tag);

    if (!tagEntries) {
      setValue(reducedTaggedProducts, "", products);
      continue;
    }

    const tagName = tagEntries[1];
    const tagIndex = Number.parseInt(tagEntries[2]);

    if (Number.isInteger(tagIndex)) {
      setValue(reducedTaggedProducts, `${tagName}:${tagIndex}`, products);
    } else if (tagName?.length) {
      let otherTagIndex = -1;

      const tagVariants = Object.keys(reducedTaggedProducts);

      for (const tag of tagVariants) {
        const regex = new RegExp(`^${tagName}:([0-9]+)$`).exec(tag);

        if (!regex) continue;

        const foundTagIndex = Number.parseInt(regex[1]);

        if (otherTagIndex === -1 || foundTagIndex < otherTagIndex)
          otherTagIndex = foundTagIndex;
      }

      if (otherTagIndex === -1) {
        setValue(reducedTaggedProducts, "", products);
      } else {
        setValue(
          reducedTaggedProducts,
          `${tagName}:${otherTagIndex}`,
          products
        );
      }
    } else {
      setValue(reducedTaggedProducts, "", products);
    }
  }

  return [reducedTags, reducedTaggedProducts];
};
