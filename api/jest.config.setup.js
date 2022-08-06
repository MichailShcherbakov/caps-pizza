const { config } = require("dotenv");
require("./src/utils/number-times");

config();

jest.setTimeout(15000); // 15 sec
