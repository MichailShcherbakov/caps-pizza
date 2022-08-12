interface Number {
  times(cb?: (index: number) => void): void;
  toFixedFloat(fractionDigits?: number): number;
}
