const mongoose = require('mongoose');
const { Schema } = mongoose;

//data validation
const UserSchema = new Schema({
  //these all are variables
    firstName:{
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20
    },
    lastName:{
      type: String
    },
    age:{
      type: Number,
      min:14,
      max:70,
      required: true
    },
    gender:{
      type: String,

      //user sirf ye strings hi post kar payega
      enum: ["male","female","others"],
      //OR
      validate(value){
        if(!["male","female","others"].includes(value))
          throw new Error("Invalid Gender")
      }
      
    },
    emailId:{
      type: String,
      required: true,
      unique: true,
      //age piche space na ho
      trim: true,
      lowercase: true,
      immutable: true
    },
    password:{
      type: String,
      required: true
    },
    photo:{
      type: String,
      default: "This is the default photo link"
    }
},{timestamps:true})
//timestamps: created and updated time of object/user



// UserSchema.methods.getJWT = function(){

//   // jwt.sign({_id:people._id, emailId:people.emailId},"Rohit@123",{expiresIn:100})

//   const ans = jwt.sign({_id:this._id, emailId:this.emailId},"Rohit@123",{expiresIn:100})

// // we can use all the properties of people using this keyword
// //edhar arrow function use na kare, as yaha this ka matlab alag hota hai
// //normally this points jisne getJWT ko call kiya

//   return ans;
// }

//esehi sabke liye bana sakte hai


//creating class
const User = mongoose.model("user", UserSchema)

module.exports = User;


//class ke andar variables, aur methods rehte hai

//static function-hw