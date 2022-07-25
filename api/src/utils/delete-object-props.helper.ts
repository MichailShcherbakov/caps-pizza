export function deleteObjectPropsHelper<K extends keyof T, T>(
  obj: T,
  props: (keyof T)[]
): Omit<T, K> {
  for (const prop of props) delete obj[prop];
  return obj;
}

export function deleteObjectsPropsHelper<K extends keyof T, T>(
  objs: T[],
  props: (keyof T)[]
): Omit<T, K>[] {
  return objs.map((o) => deleteObjectPropsHelper(o, props));
}

export default deleteObjectPropsHelper;
