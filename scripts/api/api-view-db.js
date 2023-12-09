const mongoose = require("mongoose");
const { loadNodeEnv } = require("../../src/env-handler");

loadNodeEnv();

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión:"));
db.once("open", async () => {
  try {
    const collections = await db.db.listCollections().toArray();
    for (const collection of collections) {
      console.log("Collection:", collection.name);
      const Model = mongoose.model(
        collection.name,
        new mongoose.Schema({}),
        collection.name,
      );
      const documents = await Model.find({}).exec();
      console.log(
        "Documents:",
        documents.map((document) => document),
      );
      console.log("------------------------");
    }

    // Cierra la conexión a la base de datos
    mongoose.connection.close();
  } catch (err) {
    console.error("Error:", err);
    mongoose.connection.close();
  }
});

// TODO: hacer un controlador para esto
// NOTE: estaria bien que ademas se pueda hacer algo asi: /view-db/:collection
/* app.get("/view-db", async (req, res, next) => {
const db = mongoose.connection;
try {
  const result = {};
  const collections = await db.db.listCollections().toArray();
  for (const collection of collections) {
    if (!result[collection.name]) result[collection.name] = [];
    if (!mongoose.models[collection.name]) {
      mongoose.model(
        collection.name,
        new mongoose.Schema({}),
        collection.name
      );
    }
    const Model = mongoose.models[collection.name];
    const documents = await Model.find({}).exec();
    result[collection.name] = documents;
  }
  res.status(200).json(result);
} catch (err) {
  console.error("Error getting /view-db:", err);
  next(err);
}
}); */
