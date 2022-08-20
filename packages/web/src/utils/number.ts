Number.prototype.times = function (cb) {
  if (!cb) return;

  const num = Number(this);

  for (let i = 0; i < num; ++i) cb(i);
};

Number.prototype.map = function <T>(cb: (index: number) => T) {
  if (!cb) return [];

  const num = Number(this);
  const array = Array<T>();

  for (let i = 0; i < num; ++i) array.push(cb(i));

  return array;
};

export {};
