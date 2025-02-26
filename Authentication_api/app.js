const express=require("express");
const mongoose=require("mongoose");
const router= require("./routes/users");
const errorHandler=require("./middlewared/errorHandler");
const app=express();
mongoose
    .connect("mongodb://localhost:27017/auth-api")
    .then(()=>console.log("Db connected successfully"))
    .catch((e)=>console.log(e));
//!Middlewares
app.use(expreess.json());//pass incoming json data from the user
//!Routes
app.use("/",router);
//!error handler
app.use(errorHandler);
//!start the server
const PORT=8000;
app.listen(PORT.console.log(`Srver is up and running`));