const validator = require("validator")

function validateUser(data){
        //validate kya uske andar first name hai
        //req.body ke andar data aya hai, first name present hona chahiye
        const mandatoryField = ["firstName","emailId","age","password"]

        // const IsAllowed = Object.keys(req.body).every((keys)=> mandatoryField.includes(keys))       wrong
        const IsAllowed = mandatoryField.every((k)=> Object.keys(data).includes(k))

        if(!IsAllowed)
            throw new Error("Fields Missing")


        //password ka validation 
        //firstName min-2 max -20
        //email id ko bhi api level pe validate
        //par ese to code me bhasar mach jayega
        //so validation in a function
        //khudka logic likhna nhi hoga, use npm validator


        if(!validator.isEmail(data.emailId))
            throw new Error("Invalid Email")
        if(!validator.isStrongPassword(data.password))
            throw new Error("Weak Password")
        if(!(data.firstName.length>=3 && data.firstName.length<=20))
            throw new Error("Name should have atleast 3 char and atmost 20 char")




}
module.exports = validateUser;