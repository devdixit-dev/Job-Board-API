import ConnectDatabase from "./config/Database";
import Server from "./server";

(async () => {
  await ConnectDatabase();
  Server();
})();