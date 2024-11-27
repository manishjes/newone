import mongoose from "mongoose";
import constants from "../utils/constants";

const dbConfig = async (ATLAS_URL: any, DB_URL: any, DB_NAME: any) => {
  const options: object = {};
  const localURL: string = DB_URL + DB_NAME;
  const URI: string = ATLAS_URL ? ATLAS_URL : localURL;
  await mongoose
    .connect(URI, options)
    .then(() =>
      console.log(
        ATLAS_URL ? constants.message.clConnect : constants.message.dbConnect
      )
    )
    .catch((err: any) => {
      console.log(err);
    });
};

export default dbConfig;
