const express = require('express')
const cors = require("cors");
const path = require('path')
const fs = require('fs');
const cookieParser = require("cookie-parser");
const session = require('express-session')
const CONSTANTS = require("./constants/constants");
require("dotenv").config();
require("./config/db")


const app = express()


const corsOptions = {
    origin: CONSTANTS.BASE_URL_OF_FRONT_END,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  };
app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());

app.use(
    session({
      secret: process.env.SECRET,
      resave: true,
      saveUninitialized: true,
    })
  );

  const uploadDir = path.join(__dirname, '..','public', 'uploads');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

  app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads'), {
    setHeaders: (res, path) => {
      console.log(`Serving file: ${path}`); 
    }
  }));

  // app.use('/uploads',express.static(path.join(__dirname,"public","uploads")));
  app.use("/", require('./routes/userRoutes'));
  app.use("/admin",  require("./routes/adminRoutes"));   

const PORT = process.env.PORT ||5001
app.listen(PORT ,()=>{
    console.log(`Backend is running on the port ${PORT}`)
})



