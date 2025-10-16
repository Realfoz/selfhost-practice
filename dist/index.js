import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { Config } from "./config.js";
import { validateChirpHandler } from "./api/validate_chirp.js";
const app = express(); // sets up the main server
const PORT = 8080;
const api = express.Router(); // sets up the sub routey server thingie, server but smol
const admin = express.Router(); // sets up the admin routing
//middleware layer
app.use(express.json()); // this needs to be before any moutns or routing
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc);
// mounts
app.use("/api", api); // mounts the routing to url/api/endpoint
app.use("/admin", admin); // mounts the admin routing
//main app end points
app.use("/app", express.static("./src/app")); // turns out its called routing and its important, who would have thunk
// api end points
api.get("/healthz", handlerReadiness); // sets up the healthz end point that triggers the handler when visited
api.post("/validate_chirp", validateChirpHandler);
//admin end points
admin.get("/metrics", (req, res) => {
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${Config.fileserverHits} times!</p>
  </body>
</html>`);
});
admin.post("/reset", (req, res) => {
    Config.fileserverHits = 0; // resets the config to 0
    res.type("text/plain").send("OK");
});
// other
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
