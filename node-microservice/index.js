import express from "express";
import { DaprServer, DaprClient, HttpMethod } from "@dapr/dapr";
import dotenv from "dotenv";
import { OPAClient } from "@styra/opa";

const app = express();

dotenv.config();

const APP_HOST = "0.0.0.0";
const APP_PORT = 5000;

const DAPR_HOST = "0.0.0.0";
const DAPR_PORT = 3500;

const daprServer = new DaprServer({
  serverHost: APP_HOST,
  serverPort: APP_PORT,
  serverHttp: app,
  clientOptions: { daprHost: DAPR_HOST, daprPort: DAPR_PORT },
});

daprServer.start().then(() => {
  console.log(`Server started on ${APP_HOST}:${APP_PORT}`);
});

const daprClient = new DaprClient({ daprHost: DAPR_HOST, daprPort: DAPR_PORT });

// Note: Middleware for system requests
async function middleware(req, res, next) {
  // Note: As opposed to using an sdk, a direct HTTP POST request can be made to OPA for policy checks.
  const opa = new OPAClient(process.env.OPA_BASE_URL);

  const opa_response = await opa.evaluate(process.env.OPA_DAPR_AUTH_POLICY_PATH, {
    "dapr-api-token": req.headers["dapr-api-token"],
  });

  if (!opa_response.allow) return res.status(403).json({ message: "Forbidden" });

  return next();
}

// ROUTES

app.get("/health", (_, res) => {
  console.log("Received health check request.");
  return res.status(200).json({ message: "Server is up and running" });
});

app.get("/get-data", (_, res) => {
  const ext_app_id = process.env.EXT_SERVICE_APP_ID;
  const ext_method = "system/data";

  daprClient.invoker.invoke(ext_app_id, ext_method, HttpMethod.GET).then((response) => {
    return res.status(200).json(response);
  });
});

app.get("/system/data", middleware, (req, res) => {
  console.log("Received request for secure system data.");
  return res.status(200).json({ message: "Secure system data" });
});
