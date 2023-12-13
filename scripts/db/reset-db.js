const mongoose = require("mongoose");
const { loadNodeEnv } = require("../../src/env-handler");
const UserModel = require("../../src/user/user-model");
const UserRoleModel = require("../../src/user/user-model-role");
const PlaceModel = require("../../src/place/place-model");
const PlaceStateModel = require("../../src/place-state/place-state-model");
const PlaceOptionModel = require("../../src/place-option/place-option-model");
const PlaceOptionTypeModel = require("../../src/place-option-type/place-option-type-model");
const users = require("./seed-data/users.json");
const userRoles = require("./seed-data/user-roles.json");
const places = require("./seed-data/places.json");
const placeStates = require("./seed-data/place-states.json");
const placeOptions = require("./seed-data/place-options.json");
const placeOptionTypes = require("./seed-data/place-option-types.json");

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

const preparePlaces = (places, user, state, option, optionType) => {
  return places.map((place) => ({
    ...place,
    user: user,
    state: state,
    place_option: option,
    place_option_type: optionType,
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
    // TODO: ver si da igual guardar todo el objeto o solo el id...aclarar como funciona esto, lo mismo es lo que hace por defecto
    // ahora mismo como esta funciona ok
    await UserModel.insertMany(users);
    await UserRoleModel.insertMany(userRoles);
    await PlaceStateModel.insertMany(placeStates);
    await PlaceOptionModel.insertMany(placeOptions);
    await PlaceOptionTypeModel.insertMany(placeOptionTypes);
    const firstUser = await getFirstDoc(UserModel);
    const firstPlaceState = await getFirstDoc(PlaceStateModel);
    const firstPlaceOption = await getFirstDoc(PlaceOptionModel);
    const firstPlaceOptionType = await getFirstDoc(PlaceOptionTypeModel);
    await PlaceModel.insertMany(
      // update json fields to valid ObjectId
      preparePlaces(
        places,
        firstUser,
        firstPlaceState,
        firstPlaceOption,
        firstPlaceOptionType,
      ),
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
