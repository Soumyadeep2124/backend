const jwt = require('jsonwebtoken')
const User = require("../Models/users");
const redisClient = require('../config/redis');


const userAuth  = async (req,res,next)=>{
    try{
        const {token} = req.cookies;

       //user ke pass token hai ya nhi
       if(!token){
        throw new Error("Token Doesn't exist")
       }

       //if token exist then we will verify token valid or not
       //if not error will be shown by catch
       const payload = jwt.verify(token, process.env.SECRET_KEY)
       
       const{_id} = payload;

       //payload ke andar id hai ya nhi
       if(!_id){
        throw new Error("ID is missing")
       }


       const result = await User.findById(_id)

       if(!result){
        throw new Error("User does not exist")
       }

       //check karenge token redis me hai to ni, agar hoga, to error denge
       const IsBlocked = await redisClient.exists(`token:${token}`)

       if(IsBlocked)
        throw new Error("Invalid Token")



    //    result ko store karne ke liya, warna jab next me jayega use kese pata chalega result kya hai
       req.result = result

       next()
    }
    catch(err){
        res.send("Error:"+err.message)
    }

}

module.exports = userAuth;


// payload me creation time automatic ata hai,request agar nhi aya to sabka payload same dikhega
// payload different hone se hi ,har bar, (jitni bhar bhi logi karo) new token banta hai