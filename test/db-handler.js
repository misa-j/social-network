const mongoose = require("mongoose");

/**
 * Connect to the database.
 */

module.exports.connect = async () => {
  const uri = process.env.TEST_DATABASE;

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  await mongoose.connect(uri, mongooseOpts);
};

/**
 * Drop database and close the connection.
 */

module.exports.closeDatabase = async () => {
  //await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  console.log("closing db");
};

/**
 * Remove all the data for all db collections.
 */

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
  console.log("clearing db");
};
