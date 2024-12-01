import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

const getEnv = () => {
  const env = process.env.NODE_ENV;

  if (env === undefined) {
    return "local";
  }

  return env;
};

dotenv.config({ path: `.env.${getEnv()}` });

if (!process.env.PORT) {
  console.log(`No port value specified.`);
}

const PORT = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/sandbox", (req, res) => {
  fetch("https://api.onepeloton.com/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username_or_email: process.env.PELOTON_USERNAME,
      password: process.env.PELOTON_PASSWORD,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.send(error);
    });
});
