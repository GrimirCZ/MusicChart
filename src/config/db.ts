import * as Mongoose from "mongoose";
import { MONGO_URI } from "./variables";

export let database: Mongoose.Connection

export const connect = async () => {
    await Mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        // useFindAndModify: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
    });
    Mongoose.set('debug', true);

    database = Mongoose.connection;
    database.once("open", async () => {
        console.log("Connected to database");
    });
    database.on("error", () => {
        console.log("Error connecting to database");
    });
};

export const disconnect = async () => {
    if(!database) {
        return;
    }
    await Mongoose.disconnect();
};

const DB = {connect, disconnect, database}

export default DB
