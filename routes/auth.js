const express = require("express");

const authRouter =express.Router()
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const User = require("../Models/users")
const redisClient = require("../config/redis")
const userAuth = require("../middleware/userAuth")


//  /auth/register dena padega

authRouter.post("/register", async (req,res)=>{

    try{

        validateUser(req.body)

        //Converting password into hashing
        req.body.password = await bcrypt.hash(req.body.password,10)

        //Creating object of User class
        await User.create(req.body);
        res.send("User registered successfully")

    }
    catch(err){
        res.send("Error" + err.message)
    }
})

//app.post is a api
//OR api endpoints
authRouter.post("/login",async (req,res)=>{
    try{

        // const people = await User.findById(req.body._id)
        //hume _id kese pata chalega, so ye use ni karenge

       const people = await User.findOne({emailId:req.body.emailId})

    //    if(!(req.body.emailId===people.emailId))
    //        throw new error("Invalid credentials")

       const IsAllowed = await bcrypt.compare(req.body.password, people.password)

       if(!IsAllowed)
           throw new Error("Invalid credintials");

       //invalid credintials - hacker confuse email galat, ya pass galat, esliye esa likhna


       //jwt token bhejna chata hu

       const token = jwt.sign({_id:people._id, emailId:people.emailId},process.env.SECRET_KEY,{expiresIn:100})
       //{}- payload, key
       //header khud include ho jayega


    //    const token = people.getJWT()
    //if we use methods in userSchema



       res.cookie("token",token)
       //in key value pair

       res.send("Login Successfully");
    }
    catch(err){
        res.send("Error:"+err.message)
    }
})

//1 jan 1970 se time count - token creation time/expire time

// authRouter.post("/logout",async (req,res)=>{
//     try{

//       //server jab new token dega, tab clienta ke pass purana token del ho jayega
//       //so, logout ke samay server ek invalid token generate kar dega
//       //   res.cookie("token","hsbwsjwjnsm")

//       //OR cookies ko hi expire kar lo
//       res.cookie("token",null,{expires:new Date(Date.now())})
//       res.send("Logged out successfully")

//       //but agar me cookie copy krke rakh diya, to jab server null bhejega , tab bhi me firse paste kar dunga
//       //because token expire nhi hua, wo bas delete hua hai

//       //soln - jo token se logout hua hai, db me ek list bana de, aur unko access nhi dega
//       //token jab invalid ho jaye tab db se del kar lo
//       //par isse to db call karna padega
//       //so server pe ram pe hi rakh deta hu
//       //so replica servers me bi passon karna padega

//       //here comes redis - this db is very fast
//       //this db is in ram (in memory) not i hardisk, so it is fast
//       //redis me wo data store karunga, jo permanent nhi hai, as ram volatile
//       //in memory ka dat as a backup redis ke hd me bhi rehta hai
//       //we use redis db for cache
//       //redis, node dono alag server pe rakhenge, rakh sakte par then ram ke liye ladai ho jayegi and scalabilty isuue
        



//       //redis me hum token store store karenge, jab user logout karega
//       //aur jab bhi request karenge, hum pehle chech wo token redis me hai ya nhi
//       //jab token access ho jayega, tab redis khus hi use delete kar dega (timestamp add kar denge)
//     }
//     catch(err){
//         res.send("Error:"+err.message)
//     }
// })

authRouter.post("/logout",userAuth, async (req,res)=>{
    try{
      const  {token} = req.cookies;
      console.log(token);

      const payload = jwt.decode(token)
      console.log(payload)

      await redisClient.set(`token:${token}`,"Blocked");
    //   await redisClient.expire(`token:${token}`,1800)
    //esme time creation se kitne der bad expire hoga, wo ayega , ttl- total time to leave
    
    //par expireAt me 1970 se kitse sec bad expire hoga, wo ayega, kiuki payload wohi time stored rehta hai
      await redisClient.expireAt(`token:${token}`,payload.exp)

      res.cookie("token",null,{expires:new Date(Date.now())})
      res.send("Logged out successfully")
    }

    catch(err){
        res.send("Error:"+err.message)
    }
})


module.exports = authRouter



