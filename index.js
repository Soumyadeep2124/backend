const express = require("express");
const app = express();
const main = require("./database")
const User = require("./Models/users")
const validateUser = require("./utils/validateUser")
const bcrypt = require("bcrypt")
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const userAuth = require("./middleware/userAuth")
require('dotenv').config()
const authRouter = require("./routes/auth")
const userRouter = require("./routes/user")
const commentRouter = require("./routes/comment")
const redisClient = require("./config/redis")
const rateLimiter = require("./middleware/rateLimiter")



app.use(express.json());
app.use(cookieParser())


app.use(rateLimiter);

app.use("/auth", authRouter)
app.use("/user",userRouter)
app.use("/comment",commentRouter)


const InitializeConnection = async ()=>{
    try{
        // await redisClient.connect()
        // console.log("Connected to Reddis")

        // await main()        main() se mongodb se connect ho raha hai
        // console.log("Connected to MongoDB")

        await Promise.all([redisClient.connect(),main()]);  //esme dono parallely connect ho sakenge
        console.log("DB Connected")

        app.listen(process.env.PORT, ()=>{
            console.log("Listening at port 6500")
        })

    }
    catch(err){
        console.log("Error: "+err)
    }
}

InitializeConnection()

// main()
// .then(async ()=>{
//     console.log("Connected to DB")
//     app.listen(process.env.PORT, ()=>{
//         console.log("Listening at port 6500")
//     })

// })
// .catch((err)=>console.log(err));

