// PUG
const express = require("express");
const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/index", (request, response) => {
  response.render("index", {
    subject: "Pug template engine",
    name: "our template",
    link: "https://google.com",
  });
});

// EJS
const express = require("express");
const app = express();
app.set("view engine", "ejs");

app.get("/home", (req, res) => {
  res.render("home", { animal: "Alligator" });
});
