const redisClient = require('../config/redis');

//Total time - 60 min
const windowSize = 3600
const MaxRequest = 60

// const rateLimiter = async (req,res,next)=>{

//     try{
//         //fixed window protocol
//         const ip = req.ip

//         const count = await redisClient.incr(ip);

//         if(count>10){
//             throw new Error("User Limit Exceeded")
//         }

//         if(count==1){
//             await redisClient.expire(3600)
//         }
//         console.log(count)

//         next()

//     }
//     catch(err){
//         res.send("Error "+err)

//     }

// }

const rateLimiter = async (req,res,next)=>{

    try{
        //sliding winding algo
        const key = `IP${req.ip}`;
        //req.ip simple usko accept nhi karta

        const current_time = Date.now()/1000
        const window_Time = current_time - windowSize
        //window_Time matlab es time se pehle sabko hata do

        await redisClient.zRemRangeByScore(key, 0, window_Time)
        //0 se window_Time tak sabko hata dega

        const numberOfRequest = await redisClient.zCard(key)
        //Total number of value kitni hai andar

        if(numberOfRequest>=MaxRequest){
            throw new error("Number of request exceeded")
        }

        await redisClient.zAdd(key,[{score:current_time, value:`${current_time}:${Math.random()}`}])
        //Request is added

        //key ke TTL ko increase karna
        await redisClient.expire(key,windowSize)

        next()




    }
    catch(err){
        res.send("Error "+err)

    }

}

module.exports = rateLimiter;

// incr - ip adress key ko 1 se increase kar dega, agar nhi hai, pehle create karega
// agar ek ne alag alag ip se aya- we use auto scaling(jese hi hoto sare req aya ,no of server bad jayenge)


//set - unique values
//sorted set - unique value , multiple value de sakte hai
//multiple values ko sort on basis of score
//score is use to sort different types of data, string num
//do same score reh sakte hai, par same value nhi
//duplicate value store karenge to value to accept kar lega, par score ko bhi update kar dega