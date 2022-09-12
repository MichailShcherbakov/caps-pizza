import { Product } from "~/services/products.service";
import { sortByTags } from "../helpers/sort-by-tags.helper";

describe("[Helper] sort-by-tags", () => {
  it("should correct sort category sections", () => {
    const products = [
      {
        uuid: "5",
        tags: ["first:2"],
      },
      {
        uuid: "2",
        tags: ["second:2"],
      },
      {
        uuid: "7",
        tags: ["first"],
      },
      {
        uuid: "9",
        tags: ["third"],
      },
      {
        uuid: "1",
        tags: ["first:1"],
      },
      {
        uuid: "3",
        tags: ["second:2", "first:1"],
      },
      {
        uuid: "4",
      },
      {
        uuid: "6",
        tags: ["first:2"],
      },
      {
        uuid: "8",
        tags: ["third:-54654"],
      },
      {
        uuid: "10",
        tags: [],
      },
      {
        uuid: "11",
        tags: ["#replace:4"],
      },
    ] as Product[];

    expect(sortByTags(products)).toEqual([
      ["first:1", "first:2", "second:2", "#replace:4", ""],
      {
        "first:1": [
          {
            uuid: "1",
            tags: ["first:1"],
          },
          {
            uuid: "3",
            tags: ["second:2", "first:1"],
          },
        ],
        "first:2": [
          {
            uuid: "5",
            tags: ["first:2"],
          },
          {
            uuid: "6",
            tags: ["first:2"],
          },
        ],
        "second:2": [
          {
            uuid: "2",
            tags: ["second:2"],
          },
          {
            uuid: "3",
            tags: ["second:2", "first:1"],
          },
        ],
        "#replace:4": [
          {
            uuid: "11",
            tags: ["#replace:4"],
          },
        ],
        "": [
          {
            uuid: "7",
            tags: ["first"],
          },
          {
            uuid: "9",
            tags: ["third"],
          },
          {
            uuid: "4",
          },
          {
            uuid: "10",
            tags: [],
          },
          {
            uuid: "8",
            tags: ["third:-54654"],
          },
        ],
      },
    ]);
  });
});

export {};
