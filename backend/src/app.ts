import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send("GlycAmed backend minimal ✅"));

export default app;
