const { getApp, getUserData } = require("../../jest.setup");
const constants = require("../constants");
const model = require("./user-model");
const controller = require("./user-controller").api;

describe("/users controller crud", () => {
  let app, response;
  const { email, password } = getUserData();
  let document;
  beforeAll(async () => {
    app = await getApp();
    await model.createIndexes();
  });
  afterAll(async () => {
    await model.deleteMany({});
  });

  test("/users: create", async () => {
    try {
      document = await controller.executeCreate({
        body: {
          email: email,
          password: password,
          welcome_email: true,
          role: constants.GUEST,
        },
      });
      response = {
        status: 201,
      };
    } catch (err) {
      response = { status: 500, message: err.message };
    }
    expect(response.status).toBe(201);
  });

  test("/users: read with valid id", async () => {
    response = await controller.executeRead({ _id: document._id });
    expect(response).not.toBeNull();
  });

  test("/users: read with invalid id", async () => {
    response = await controller.executeRead({
      _id: "65437512d38ac231abb6e76a",
    });
    expect(response).toBeNull();
  });

  test("/users: patch password", async () => {
    const newPassword = "Psdf|4S";
    response = await controller.executePatch({
      params: { id: document._id },
      body: { updateData: { password: newPassword } },
    });
    expect(response.password).toBe(newPassword);
  });

  test("/users: delete", async () => {
    response = await controller.executeDestroy({
      params: { id: document._id },
    });
    if (response) {
      expect(response.email).toBe(document.email);
    } else {
      expect(response).toBeNull();
    }
  });
});
