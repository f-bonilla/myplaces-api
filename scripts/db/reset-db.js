const mongoose = require("mongoose");
const { loadNodeEnv } = require("../../src/env-handler");
const UserModel = require("../../src/user/user-model");
const UserRoleModel = require("../../src/user/user-model-role");
const PlaceModel = require("../../src/place/place-model");
const PlaceStateModel = require("../../src/state/state-model");
const PlaceOptionModel = require("../../src/option/option-model");
const PlaceOptionTypeModel = require("../../src/option-type/option-type-model");
const users = require("./seed-data/users.json");
const userRoles = require("./seed-data/user-roles.json");
const places = require("./seed-data/places.json");
const placeStates = require("./seed-data/states.json");
const placeOptions = require("./seed-data/options.json");
const placeOptionTypes = require("./seed-data/option-types.json");

loadNodeEnv();
const resetDataBase = async () => {
  try {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      await mongoose.connection.db.collection(collectionName).drop();
    }
  } catch (err) {
    console.error("resetDataBase ERROR:", err);
  }
};

const preparePlaces = (places, user) => {
  return places.map((place) => ({
    ...place,
    user: user,
  }));
};

const getFirstDoc = async (collection) => {
  const doc = await collection.findOne();
  return doc;
};

const init = async () => {
  console.clear();
  try {
    await mongoose.connect(process.env.DB_CONNECTION);

    await resetDataBase();

    await UserModel.createIndexes();
    await UserRoleModel.createIndexes();
    await PlaceStateModel.createIndexes();
    await PlaceOptionModel.createIndexes();
    await PlaceOptionTypeModel.createIndexes();
    await PlaceModel.createIndexes();
    await UserModel.insertMany(users);
    await UserRoleModel.insertMany(userRoles);
    await PlaceStateModel.insertMany(placeStates);
    await PlaceOptionModel.insertMany(placeOptions);
    await PlaceOptionTypeModel.insertMany(placeOptionTypes);
    const firstUser = await getFirstDoc(UserModel);
    await PlaceModel.insertMany(
      // update json fields to valid ObjectId
      preparePlaces(places, firstUser),
    );
    console.log("done!");
    console.log("-------------------");
  } catch (err) {
    console.error("Error:", err.name, err.message);
  } finally {
    mongoose.connection.close();
  }
};

init();
