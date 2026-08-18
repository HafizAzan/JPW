import { createApp } from "./src/app.js";
import { connectDb } from "./src/config/db.js";
import { initCloudinary } from "./src/config/cloudinary.js";
import { env } from "./src/config/env.js";

async function bootstrap() {
  await connectDb();
  initCloudinary();
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`HireHub API listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
