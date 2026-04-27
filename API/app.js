//Server
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';

import dotenv from 'dotenv';
dotenv.config();

// Establish Database Connection
import './model/connection.js';

const app=express();

app.use(fileUpload());

//to link appl lavel middleware
import ngoRouter from './router/ngorouter.js';
import rescueRouter from './router/resqrequestrouter.js';
//to read content of bodycontent:load configuration of body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended":"true"}));
//to load cross origin module

app.use(cors());
//Application level middleware
app.use("/ngo",ngoRouter);
app.use("/rescue",rescueRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server invoked at link http://localhost:${PORT}`);
});