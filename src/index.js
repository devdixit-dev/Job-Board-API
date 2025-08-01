import ConnectDatabase from "./config/database.config.js";
import Server from "./server.js";

(async () => {
  await ConnectDatabase();
  Server();
})();