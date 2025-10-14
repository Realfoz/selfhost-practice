import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { Config } from "./config.js";

const app = express();
const PORT = 8080;

//middleware layer
app.use(middlewareLogResponses)
app.use("/app", middlewareMetricsInc)

//main app end points
app.use("/app", express.static("./src/app")); // fuck this shit right here. its basicly moving where its checking for files from the root directory of the project to src/app but requires /app in the url to access it
app.get("/healthz", handlerReadiness); // sets up the healthz end point that triggers the handler when visited
app.get("/metrics", (req, res) => {
  
  res.send(`Hits: ${Config.fileserverHits}`); // end point displays current hits to the server since reset
});

app.get("/reset", (req, res) => { // end point that resets the metrics page withput reseting the server
  Config.fileserverHits = 0 // resets the config to 0
  res.type("text/plain").send("OK") 
 });


app.listen(PORT, () => { // will display this message when server is on and running
  console.log(`Server is running at http://localhost:${PORT}`);
});