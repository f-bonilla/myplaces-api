const i18n = require("i18n");
const mongoose = require("mongoose");
const { dbConnect, getDbState } = require("./db-handler");
const { loadNodeEnv } = require("./env-handler");
const { i18nConfigure } = require("./i18n-handler");

describe("start app OK", () => {
  beforeAll(() => {
    loadNodeEnv();
    i18nConfigure();
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  beforeEach(() => {});
  afterEach(() => {});

  test("i18n", () => {
    expect(i18n.getLocales()).toEqual(["es", "en"]);
    const key = "acc_load_error";
    let translation = i18n.getCatalog()[key];
    expect(translation).toBe(i18n.__(key));
    i18n.setLocale("en");
    translation = i18n.getCatalog()[key];
    expect(translation).toBe(i18n.__(key));
  });

  test("DB", async () => {
    await dbConnect(process.env.DB_CONNECTION);
    expect(getDbState()).toBe(1);
  });
});
