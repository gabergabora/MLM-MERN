import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import user from './routes/users.js'
import cookieParser from "cookie-parser";

//initialize express server
const app = express();

//initialize environmental congfig
dotenv.config();
const PORT = process.env.PORT;
//now setting up limit of http request body and urlencoded data
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors({ origin: true, credentials: true }));
const DB_URL = `mongodb://127.0.0.1:27017/mlm`;
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(response => {
    // console.log(`${response.connection.host}`);
    console.log('Database Connected Succesfully');
});
app.use(express.json());

app.use('/api', user);
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "somthing went wrong";
    res.status(errorStatus).send({
        success: false,
        status: errorStatus,
        message: errorMessage,               
        stack: err.stack,
    });
})
app.listen(PORT, () => console.log(`Express server is running at port ${PORT}`))
