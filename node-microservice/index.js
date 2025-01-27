import express from "express";
import { DaprServer, DaprClient, HttpMethod } from "@dapr/dapr";
import dotenv from "dotenv";

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
  console.log(`Api token: ${process.env.DAPR_API_TOKEN}`);
});

const daprClient = new DaprClient({ daprHost: DAPR_HOST, daprPort: DAPR_PORT });

// ROUTES

app.get("/health", (_, res) => {
  console.log("Received health check request.");
  return res.status(200).json({ message: "Server is up and running" });
});

app.get("/data", (req, res) => {
  console.log(`Received headers: ${JSON.stringify(req.headers)}.`);
  console.log(`Received dapr request for secure data from host: ${req.hostname}.`);
  return res.status(200).json({ message: "Secure data" });
});

app.get("/get-data", (_, res) => {
  const ext_app_id = process.env.EXT_SERVICE_APP_ID;
  const ext_method = "data";

  console.log(`Calling external service: app-id: ${ext_app_id} method: ${ext_method}.`);

  daprClient.invoker.invoke(ext_app_id, ext_method, HttpMethod.GET).then((response) => {
    return res.status(200).json(response);
  });
});
