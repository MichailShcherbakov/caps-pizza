interface Number {
  times(cb?: (index: number) => void): void;
  map<T>(cb?: (index: number) => T): Array<T>;
}
