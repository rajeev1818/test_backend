const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

const authRouter = require("./routes/auth");
const parseRouter = require("./routes/parser");
const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth",authRouter);
app.use("/api/parser", parseRouter);

app.listen(3001, () => {
    console.log("Server is Running on Port 3001");
})