const mongoose = require('mongoose');
const { Schema } = mongoose;

async function main(){
  await mongoose.connect(process.env.DB_CONNECT_KEY)

}

module.exports = main;

