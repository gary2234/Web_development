const jwt= require("jsonwebtoken");
const isAuthenticate = async(req , res , next)=>{
    //!Get the token from the header
    const headerObj = req.header;
    const token= headerObj.authorization.split(" ")[1];

    //Verify token
    const verifyToken = jwt.verify(token,"anyKey",(err,decoded)=>{
     if(err){
        return false;
     }else{
        return decoded;
     }
    });
    if(verifyToken){
        //save the user into req.obj
        req.user= verifyToken.id;
        next();
    } else{
        const err = new Error("Token expired please login again");
        next(err);
    }
};
module.exports= isAuthenticated;