import express from "express";
import cookieParser from 'cookie-parser';
import userRoutes from '@routes/userRoute';
import productRoutes from '@routes/productRoute';
import consumptionRoutes from '@routes/consumptionRoute';
import dashboardRoutes from '@routes/dashboardRoute';
import alertRoutes from '@routes/alertRoute';

const app: express.Application = express();

app.use(cookieParser());
app.use(express.json());

app.get("/api", (req, res) => res.send("GlycAmed backend minimal ✅"));

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/consumption", consumptionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/alert', alertRoutes);

export default app;
