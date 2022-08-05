interface Number {
  times(cb?: (index: number) => void): void;
}

Number.prototype.times = function (cb = () => {}) {
  const num = Number(this);

  for (let i = 0; i < num; ++i) cb(i);
};
