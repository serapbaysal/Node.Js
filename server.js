const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error')

//Load env vars
dotenv.config({path:'./config/config.env'});

//Connect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');


const app = express();


//Body Parser
app.use(express.json());




//Dev logging middleware
app.use(logger);

//Mount routers
app.use('/api/v1/bootcamps', bootcamps);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Sever running in ${process.env.NODE_ENV} node on port ${PORT}`));

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise)=>{
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(() => process.exit(1));
})