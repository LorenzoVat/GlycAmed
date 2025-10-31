import express from "express";
import cookieParser from 'cookie-parser';
import userRoutes from '@routes/userRoute';
import productRoutes from '@routes/productRoute';
import consumptionRoutes from '@routes/consumptionRoute';
import dashboardRoutes from '@routes/dashboardRoute';


const app: express.Application = express();

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => res.send("GlycAmed backend minimal ✅"));

app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/consumption", consumptionRoutes);
app.use("/dashboard", dashboardRoutes);

export default app;
