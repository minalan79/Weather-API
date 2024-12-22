import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const app = express();
const port = 8000;

// app.use(express.json());
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
const weatherAPIKey = process.env.WEATHER_API_KEY;
const CACHE_EXPIRY = 3600;

const redisClient = createClient({
  url: `redis://@${redisHost}:${redisPort}`,
});

redisClient.on("error", (err) => console.error("Redis error:", err));

// redisClient.on("connect", () => {
//   console.info("Connected to ElastiCache Redis");
// });

await redisClient.connect();

app.get("/api/:location", async (req, res) => {
  try {
    const cachedData = await client.get(req.params.location);
    if (cachedData) {
      res.json(JSON.parse(cachedData)[req.params.location]);
    }
    axios
      .get(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${req.params.location}?unitGroup=metric&key=${weatherAPIKey}&contentType=json`
      )
      .then(function (response) {
        res.json(response.data.description);
      })
      .catch(function (error) {
        // handle error
        // console.log(error);
        res.json(error);
      })
      .finally(function (response) {
        redisClient.setEx(
          req.params.location,
          CACHE_EXPIRY,
          JSON.stringify(response.data.description)
        );
      });
  } catch (error) {
    console.error("Error interacting with Redis:", error);
    throw error;
  }
});

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Define a route for the root URL to send the `index.html`
app.get("/", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
