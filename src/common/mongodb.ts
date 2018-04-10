import { MONGODB_URI } from "./secrets";
import * as mongoose from "mongoose";
import L from "./logger";

export default class MongoDatabase {
    constructor() { }

    async connect(): Promise<any> {
        const mongoUrl = MONGODB_URI;
        // (mongoose).Promise = bluebird;
        await mongoose.connect(mongoUrl);
        L.info(`Connected to MongoDB at ${mongoUrl}`);
        return true;
    }

}