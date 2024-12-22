import express from "express";
import redis from "redis";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

// app.use(express.json());
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
});

redisClient.on("error", (err) => console.error("Redis error:", err));

redisClient.on("connect", () => {
  console.info("Connected to ElastiCache Redis");
});

app.get("/api/:location", (req, res) => {
  axios
    .get(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${req.params.location}?unitGroup=metric&key=FM75S77P987JBDX57K5Z4ZU6H&contentType=json`
    )
    .then(function (response) {
      // handle success
      // console.log(response.data.description);
      res.json(response.data.description);
    })
    .catch(function (error) {
      // handle error
      // console.log(error);
      res.json(error);
    });
});

// app.get("/", (req, res) => {
//   res.sendFile("./public/index.html");
// });

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
