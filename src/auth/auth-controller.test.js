const constants = require("../constants");
const { getApp, getUserData } = require("../../jest.setup");
const request = require("supertest");
const UserModel = require("../user/user-model");

describe("/auth routes", () => {
  let app, response;
  const { email, password } = getUserData();
  let userId, userToken;
  beforeAll(async () => {
    app = await getApp();
    await UserModel.createIndexes();
  });
  afterAll(async () => {
    await UserModel.deleteMany({});
  });

  test("/aut/register new user", async () => {
    response = await request(app).post("/auth/register").send({
      email: email,
      password: password,
      welcome_email: true,
      role: constants.user.roles.USER,
    });

    const userUriParts = response.body.user_uri.split("/");
    userId = userUriParts[userUriParts.length - 1];
    userToken = response.headers["authorization"].split(" ")[1];
    expect(response.status).toBe(201);
  });

  test("/auth newUser get /users (access denied)", async () => {
    response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${userToken}`);
    expect(response.status).toBe(403);
  });

  test("/aut/register existing user", async () => {
    response = await request(app).post("/auth/register").send({
      email: email,
      password: password,
      welcome_email: true,
      role: constants.user.roles.USER,
    });
    expect(response.status).toBe(409);
  });

  test("/aut/register with invalid data", async () => {
    response = await request(app).post("/auth/register").send({
      email: "malformed@email",
      password: password,
      welcome_email: true,
      role: constants.user.roles.USER,
    });
    expect(response.status).toBe(400);
  });

  test("/aut/login with invalid credentials", async () => {
    response = await request(app).post("/auth/login").send({
      email: "invalid_user@domain.com",
      password: password,
    });
    expect(response.status).toBe(401);
  });

  test("/aut/login with valid credentials", async () => {
    response = await request(app).post("/auth/login").send({
      email: email,
      password: password,
    });
    expect(response.status).toBe(200);
  });

  test("/aut/logout user logout", async () => {
    response = await request(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${userToken}`)
      .send();
    expect(response.status).toBe(204);
  });

  test("/aut/logout guest logout (access denied)", async () => {
    response = await request(app).post("/auth/logout").send();
    expect(response.status).toBe(403);
  });
});
