const express= require("express");
const cookieParser= require("cookie-parser");
const cron= require("node-cron");
const cors= require("cors");
require("dotenv").config();
const usersRouter= require("./routes/usersRoutes");
const {errorHandler} = require("./middlewares/errorMiddleware");
const openAIRourter= require("./routes/openAIRouter");
const stripeRouter = require("./routes/stripeRouter");
const User = require("./models/Users");
require("./utils/connectDB")();

const app=express();
const PORT = process.env.PORT || 8090;
//Cron for the trial period: run every single
cron.schedule("0 0 * * * *", async()=>{
    console.log("This task runs every second");
    try{
        //get the current date
        const today= new Date();
        const updateUser= await User.updateMany(
            {
                trialActive:true,
                trialExpress:{$lt:today},
            },
            {
                trialActive: false,
                subscriptionPlan: "Free",
                monthlyRequestCount: 5,
            }
        );
        console.log(updatedUser);
    } catch(error){
        console.log(error);
    }
});

//Cron for hte free plan: run at the end of every month
cron.schedule("0 0 1 * * *", async()=>{
    try{
        const today= new Date();
        await User.updateMany(
            {
                subscriptionPlan: "Free",
                nextBillingDate:{$lt : today},
            },
            {
                monthlyRequestCount:0,
            }
        );
    } catch(error){
        console.log(error);
    }
})

//Cron for the premium plan: run at the end of every month
cron.schedule("0 0 1 * * *", async()=>{
    try {
        //get the current date
        const today= new Date();
        await User.updateMany(
            {
                subscriptionPlan: "Premium",
                nextBillingDate:{ $lt: today},
            },
            {
                monthlyRequestCount:0,
            }
        );
    } catch(error){
        console.log(error);
    }
});
//Cron paid plan
//middlewares
app.use(express.json());//pass incoming json data
app.use(cookieParser());//pass the cookie automatically
const corsOptions={
    origin: "https://localhost:3000",
    credentials:true,
};
app.use(cors(corsOptions));
app.use("/api/v1/users",userRouter);
app.use("/api/v1/openai",openAIRouter);
app.use("/api/v1/stripe",striperRouter);
//Error handleer middleware ---
app.use(errorHandler);
//start the server
app.listen(PORT,console.log(`Server is running on port${PORT}`));