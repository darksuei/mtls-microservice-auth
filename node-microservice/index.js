import express from "express";

const app = express();

const APP_PORT = 5000;

app.get("/health", (_, res) => {
  return res.status(200).json({ message: "Server is up and running" });
});

app.get("/protected", (_, res) => {
  return res.status(200).json({ message: "Protected route" });
});

app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}`);
});
