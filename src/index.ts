import ConnectDatabase from "./config/database.config";
import Server from "./server";

(async () => {
  await ConnectDatabase();
  Server();
})();