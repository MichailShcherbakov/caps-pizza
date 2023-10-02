export type StringifyHouseInfoFnPayload = {
  house: string;
  building?: string;
};

export function stringifyHouseInfo({
  house,
  building,
}: StringifyHouseInfoFnPayload): string {
  if (building) {
    house += `, кор. ${building}`;
  }

  return house;
}
