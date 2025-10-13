import express from "express";
import { handlerReadiness } from "./api/readiness.js";

const app = express();
const PORT = 8080;

app.use("/app", express.static("./src/app")); // fuck this shit right here. the dumb people version is it serves files from a new location other than the root of the directory
// the /app argument here is how it is accessed by the url so localhost:8080/app is the index.html file. why is this needed or used? fucked if i know
app.get("/healthz", handlerReadiness);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});