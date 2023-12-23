const express = require('express')
const colors = require('colors')
const morgan = require('morgan')
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = express()
const cors = require('cors')
const path = require('path')
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
app.use('/api/v1/user',require("./routes/userRoutes"))
app.use('/api/v1/admin',require("./routes/adminRoutes"))
app.use('/api/v1/doctor',require("./routes/doctorRoutes"))
app.use(express.static(path.join(__dirname, './client/build')));
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/built/index.html'));
});
dotenv.config();

connectDB();


const port = process.env.PORT || 8000

app.listen(port,()=>{
    console.log(`Server running on ${process.env.PORT}`.bgCyan.white);
})