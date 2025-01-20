import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";
import userRoute from "./routes/userRoute.ts";
import { SERVICE_PORTS } from "../../common/constants.ts";

const app = express();


// Redis client configuration
export const redisClient = createClient({
  url: "redis://localhost:6379",
});
redisClient.connect().catch(console.error);

// Session middleware
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// Body parser middleware
app.use(express.json());

// User routes
app.use("/user", userRoute);

// Start the server
app.listen(SERVICE_PORTS.USER_SERVICE, () => {
  console.log(`User service is running on port ${SERVICE_PORTS.USER_SERVICE}`);
});
