import app from "./app";
import { connectDB } from "./config/database";

const PORT = process.env.BACKEND_PORT;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();