import {router as parkRoutes} from "./park.js";

const constructorMethod = (app) => {
  app.use("/", parkRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route Not Found" });
  });
};

export default constructorMethod;