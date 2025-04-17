
const redis = require('redis')

const redisClient = redis.createClient({
    username: '',
    password: '',
    socket: {
        host: '',
        port: 
    }
})

// const connectReddis = async ()=>{
//     await redisClient.connect()
//     console.log("Connected to redis")

// }

// connectReddis()


module.exports = redisClient