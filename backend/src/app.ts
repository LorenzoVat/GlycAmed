import express from "express";
import userRoutes from '@routes/userRoute';

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send("GlycAmed backend minimal ✅"));

app.use("/user", userRoutes);

export default app;
