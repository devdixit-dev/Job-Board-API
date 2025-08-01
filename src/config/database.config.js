import mongoose from "mongoose";
import DB_NAME from "../constants/variable.js";

const ConnectDatabase = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`, { dbName: DB_NAME })
    .then(() => { console.log(`Connected to database ✅`) })
    .catch((e) => { console.log(`Error while connecting to database - ${e}`) });
  }
  catch(error) {
    console.log(`MongoDB error - ${error}`);
  }
}

export default ConnectDatabase;