const express = require("express");

const userRouter =express.Router()
const userAuth = require("../middleware/userAuth")
const User = require("../Models/users")



// userRouter.get("/info", async (req,res)=>{
//     try{

//         //validate the user first

//         const payload = jwt.verify(req.cookies.token, "Rohit@123")
//         const result = await User.findById(payload._id);
        
//         res.send(result)
//     }
//     catch(err){
//         res.send("error"+ err.message)
//     }
// })

userRouter.get("/", userAuth, async (req,res)=>{
    try{
       res.send(req.result)

    }
    catch(err){
        res.send("Error"+err.message)

    }
    //ye same code sab api call me likhna padega
})

userRouter.delete("/:id", userAuth, async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.send("deleted Succesfully")

    }
    catch{
        res.send("Error"+err.message)

    }
})

userRouter.patch("/", userAuth, async (req,res)=>{
    try{
        //desttructuring, id alag ho jayega aur baki chiz ek me rehega
        const {_id, ...update}=req.body
        await User.findByIdAndUpdate(_id,update,{"runValidators":true})
        //by default validotrs check nhi hote during update, esliye esa likha
        res.send("Updated Successfully")
    }
    catch(err){
        res.send("Error"+err.message)
    }
})

module.exports = userRouter