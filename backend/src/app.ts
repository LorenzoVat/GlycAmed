import express from "express";
import userRoutes from '@routes/userRoute';
import productRoutes from '@routes/productRoute';

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send("GlycAmed backend minimal ✅"));

app.use("/user", userRoutes);
app.use("/product", productRoutes);

export default app;
