Number.prototype.times = function (cb) {
  const num = Number(this);

  for (let i = 0; i < num; ++i) cb(i);
};

Number.prototype.toFixedFloat = function (fractionDigits = 2): number {
  const num = Number(this);

  return Number.parseFloat(num.toFixed(fractionDigits));
};

Number.prototype.map = function (cb) {
  const num = Number(this);
  const array = [];

  for (let i = 0; i < num; ++i) array.push(cb(i));

  return array;
};
