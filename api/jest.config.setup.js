const { config } = require("dotenv");
require("./src/utils/number");

config();

jest.setTimeout(15000); // 15 sec
