import express, { request } from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { config } from "./config.js";
import { middlewareErrorHandler } from "./api/errors.js";
import { createUserHandler } from "./api/create_user.js";
import { handleAdminReset } from "./api/reset.js";
import { db } from "./db/index.js";
import { chirpHandler } from "./api/chirp.js";
import { allChirpsHandler, getChirpHandler } from "./api/chirps.js";
import { loginHandler, refreshTokenHandler, revokeTokenHandler } from "./api/auth.js";
import { userCredsUpdateHandler } from "./api/users.js";



const app = express(); // sets up the main server
const api = express.Router() // sets up the sub routey server thingie, server but smol
const admin = express.Router() // sets up the admin routing

//middleware layer
app.use(express.json()); // this needs to be before any mounts or routing
app.use(middlewareLogResponses) 
app.use("/app", middlewareMetricsInc)

// mounts
app.use("/api", api) // mounts the routing to url/api/endpoint
app.use("/admin", admin) // mounts the admin routing

//main app end points
app.use("/app", express.static("./src/app")); // turns out its called routing and its important, who would have thunk

// api end points
api.get("/healthz", handlerReadiness); // sets up the healthz end point that triggers the handler when visited
api.post("/users", createUserHandler) // add user end point
api.post("/chirps", chirpHandler) // lets you add a chirp
api.get("/chirps", allChirpsHandler) // gets all chirps in the db in asc date order
api.get("/chirps/:chirpID", getChirpHandler) //gets specific chirp
api.post("/login", loginHandler) 
api.post("/refresh", refreshTokenHandler) //refreshes 60 day token from current token data
api.post("/revoke", revokeTokenHandler)
api.put("/users", userCredsUpdateHandler) 

//admin end points
admin.get("/metrics", (req, res) => {
   res.set('Content-Type', 'text/html; charset=utf-8')
   res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileServerHits} times!</p>
  </body>
</html>`)
 
});

admin.post("/reset", (req, res) => handleAdminReset(req, res, config, db)); // passes all the goodies to the reset endpoint

// other
app.listen(config.api.port, () => { // will display this message when server is on and running
  console.log(`Server is running at http://localhost:${config.api.port}`);
});

// error handeling middleware
app.use(middlewareErrorHandler);// must be last so its a fail safe for everything