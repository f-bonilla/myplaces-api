const { encrypt, bcryptCompare } = require("./crypt-handler");

describe("crypt handler", () => {
  const validPassword = "2SAd47f5DFgs2";
  const invalidPassword = "2SADFgs2d47f5";
  test("encrypt password", async () => {
    const password = validPassword;
    const hashedPassword = await encrypt(password);

    expect(typeof hashedPassword).toBe("string");
  });

  test("verify password", async () => {
    const originalPassword = validPassword;
    const hashedPassword = await encrypt(originalPassword);

    const result = await bcryptCompare(originalPassword, hashedPassword);
    expect(result).toBe(true);

    const incorrectPassword = invalidPassword;
    const result2 = await bcryptCompare(incorrectPassword, hashedPassword);
    expect(result2).toBe(false);
  });
});
