import ConnectDatabase from "./config/Database";
import Server from "./server";

Server();

await ConnectDatabase();