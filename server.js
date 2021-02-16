let express = require("express");
let fs = require("fs");
const serveStatic = require("serve-static");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static("./public"));

app.listen(PORT, () => {
    console.log("listening on port: " + PORT)
})