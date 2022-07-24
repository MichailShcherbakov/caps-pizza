import Api from "./helpers/api.helper";
import TestingModule from "./helpers/testing-module.helper";

describe("[Categories Module] ... ", () => {
  let testingModule: TestingModule;
  let api: Api;

  beforeAll(async () => {
    testingModule = new TestingModule();
    await testingModule.init();

    api = new Api(testingModule.app);
  });

  afterAll(async () => {
    await testingModule.drop();
  });

  describe("[Get /categories] ...", () => {
    it("should return all exists categories", async () => {
      const response = await api.getCategories();

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        statusCode: 200,
        data: [],
      });
    });
  });
});
