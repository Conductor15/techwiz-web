const mongoose = require("mongoose");
// const generate = require("../../../helpers/generate");

const forgotPasswordSchema = new mongoose.Schema({
    email:String,
    otp: String,
    expireAt: {
        type: Date,
        expire: 0
    }
    },{
        timestamps:true
    }
);

const forgotPassword = mongoose.model("forgotPassword", forgotPasswordSchema, "forgot-password");

module.exports = forgotPassword;