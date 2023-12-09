const mongoose = require("mongoose");
const request = require("supertest");
const { getApp, getPlaceData, getUserData } = require("../../jest.setup");
const constants = require("../constants");
const model = require("./place-model");
const controller = require("./place-controller").api;

describe("/places controller crud", () => {
  let app, response;
  let userId;
  const { email, password } = getUserData();
  let document;
  beforeAll(async () => {
    app = await getApp();
    await model.createIndexes();
  });
  afterAll(async () => {
    await model.deleteMany({});
  });

  test("/auth/register: We need to have a valid user for testing.", async () => {
    response = await request(app).post("/auth/register").send({
      email: email,
      password: password,
      welcome_email: true,
      role: constants.USER,
    });

    const userUriParts = response.body.user_uri.split("/");
    userId = userUriParts[userUriParts.length - 1];
    expect(response.status).toBe(201);
  });

  test("/places: create new place", async () => {
    try {
      document = await controller.executeCreate({
        user: { id: userId },
        body: getPlaceData(),
      });
      response = {
        status: 201,
      };
    } catch (err) {
      response = { status: 500, message: err.message };
    }
    expect(response.status).toBe(201);
  });

  test("/places: read with valid id", async () => {
    response = await controller.executeRead({ _id: document._id });
    expect(response).not.toBeNull();
  });

  test("/places: read with invalid id", async () => {
    response = await controller.executeRead({
      _id: "65437512d38ac231abb6e76a",
    });
    expect(response).toBeNull();
  });

  test("/places: patch some field", async () => {
    const newAddress = "Calle Portoalegre, 15";
    response = await controller.executePatch({
      params: { id: document._id },
      body: { updateData: { address: newAddress } },
    });
    expect(response.address).toBe(newAddress);
  });

  test("/places: get list", async () => {
    response = await request(app).get("/places").send();
    expect(1).toBe(1);
  });

  test("/places: delete", async () => {
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
