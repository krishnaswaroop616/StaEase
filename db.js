const mongoose=require("mongoose");

async function main(url) {
    await mongoose.connect(url);
    console.log("DB connected");
}

module.exports={main};