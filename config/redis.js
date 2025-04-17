
const redis = require('redis')

const redisClient = redis.createClient({
    username: 'default',
    password: '63RKaHGhqSrQn8wrQnIxuZfn9PJqz3iX',
    socket: {
        host: 'redis-10547.crce182.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 10547
    }
})

// const connectReddis = async ()=>{
//     await redisClient.connect()
//     console.log("Connected to redis")

// }

// connectReddis()


module.exports = redisClient