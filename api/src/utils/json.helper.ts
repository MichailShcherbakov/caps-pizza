export function toJson<T>(obj: T): string {
  return JSON.stringify(obj);
}

export function fromJson<T>(str: string): T {
  return JSON.parse(str);
}

export default {
  toJson,
  fromJson,
};
