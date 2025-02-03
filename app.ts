import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from 'cors';
import { generateResponse } from "./controllers";

dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT;
app.use(bodyParser.json());

app.post("/generate", generateResponse);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
