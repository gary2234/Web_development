const asyncHandler = require('express-async-handler');
const { calculateNextBillDate, shouldRenewSubscriptionPlan } = require('../utils');
const { payment, user } = require('../models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Your code to handle Stripe payment will go here
const handleStripePayment = asyncHandler(async (req, res) => {
    const { amount,subscriptionPlan}=req.body;
    const user = req?.user;
    console.log(user);
    try{
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Number(amount) * 100,
            currency: 'usd',
            metadata: {
                userId: user.id?.toString(),
                subscriptionPlan,
                userEmail: user.email,
            },
        });
        //Send the response
        res.json({ clientSecret: paymentIntent.client_secret,paymentId:paymentIntent.id ,metadata:paymentIntent.metadata});
    } catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }});
//--verify payment
const verifyPayment = asyncHandler(async (req, res) => {
    const { paymentId } = req.params;
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
        res.json({ paymentIntent });
        if(paymentIntent.status==='succeeded'){
            //get the info metada
            const {userId,subscriptionPlan,userEmail}=paymentIntent.metadata;
            ///find the user
            const user = await User.findById(userId);
            if(!user){
                return res.status(404).json({message:"User not found"});
            }
            //get payment details
            const amount = paymentIntent.amount/100;
            const currency=paymentIntent.currency;
            const paymentId=paymentIntent.id;
            //create the payment histor
            const newPayment = new Payment({
                amount,
                currency,
                reference:paymentId,
                email:userEmail,
                subscriptionPlan,
                user: userId
            });

            if(subscriptionPlan=="Basic"){
                //update the user
                const updatedUser = await User.findByIdAndUpdate(ussrId,{
                    subscriptionPlan,
                    nextBillingDate:calculateNextBillDate(30),
                    apiRequestCount:0,
                    monthlyRequestCount:50,
                    subscriptionPlan:"Basic",
                    $addToSet : {payments:newPayment?._id},
                }
                );
                res.json({
                    status:true,
                    message:"payment verified , user updated", 
                    updatedUser,
                })
            }
            if (subscriptionPlan === "Premium") {
                //update the user
                const updatedUser = await User.findByIdAndUpdate(userId, {
                  subscriptionPlan,
                  trialPeriod: 0,
                  nextBillingDate: calculateNextBillingDate(),
                  apiRequestCount: 0,
                  monthlyRequestCount: 100,
                  subscriptionPlan: "Premium",
                  $addToSet: { payments: newPayment?._id },
                });
        
                res.json({
                  status: true,
                  message: "Payment verified, user updated",
                  updatedUser,
                })};
    }} catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});
const handleFreeSubscription = asyncHandler(async (req, res) => {
    //Get the login user
    const user = req?.user;
    console.log("free plan", user);
  
    //Check if user account should be renew or not
    try {
      if (shouldRenewSubcriptionPlan(user)) {
        //Update the user account
        user.subscriptionPlan = "Free";
        user.monthlyRequestCount = 5;
        user.apiRequestCount = 0;
        user.nextBillingDate = calculateNextBillingDate();
  
        //Create new payment and save into DB
        const newPayment = await Payment.create({
          user: user?._id,
          subscriptionPlan: "Free",
          amount: 0,
          status: "success",
          reference: Math.random().toString(36).substring(7),
          monthlyRequestCount: 0,
          currency: "usd",
        });
        user.payments.push(newPayment?._id);
        //save the user
        await user.save();
        //send the response
        res.json({
          status: "success",
          message: "Subscription plan updated successfully",
          user,
        });
      } else {
        return res.status(403).json({ error: "Subcription renewal not due yet" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  });
  

module.exports = { handleStripePayment, verifyPayment ,handleFreeSubscription};