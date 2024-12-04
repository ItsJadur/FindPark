import express from "express";
const app = express();
import configRoutes from "./routes/index.js";
import { engine } from "express-handlebars"

app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", engine({
  helpers: {
      eq: (a, b) => a === b,
      formatDate: (date) => {
          if (!date) return '';
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          return new Date(date).toLocaleDateString(undefined, options);
      }
  }
}))
app.set("view engine", "handlebars");
app.set("views", "./views")

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});