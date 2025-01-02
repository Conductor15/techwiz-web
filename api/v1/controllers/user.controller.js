const md5 = require("md5");
const User = require("../models/user.model")
const forgotPassword = require("../models/forgot-password.model")

const generateHelper = require("../../../helpers/generate");
const sendMailHelper = require("../../../helpers/sendMail");


// [POST] /api/v1/users/register
module.exports.register = async (req, res) => {
    try {
        req.body.password = md5(req.body.password);
    //    console.log(req.body);
        const existEmail = await User.findOne({
            email: req.body.email,
            deleted: false
        })
        if(existEmail){
            res.json({
                code:400,
                message: "Email exist!"
            });
        }
        else{
            const user = new User({
                fullname: req.body.fullname,
                email: req.body.email,
                password: req.body.password
            })

            user.save();

            const token = user.token;
            //save cookie
            res.cookie("token", token);

            res.json({
                code:200,
                message: "Register successfully",
                token:token
            });
        }
    } catch (error) {
        res.json({
            code:400,
            message: "ERROR!"
        });
    }
};

// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    });

    if(!user){
        res.json({
            code: 400,
            message: "Email doesn't exist"
        });
        return;
    }

    const pass = req.body.password;
    if(md5(pass) !== user.password){
        res.json({
            code: 400,
            message: "wrong password"
        });
        return;
    }

    const token = user.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "Login successfully",
        token: token
    })
};

// [POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email;
    const exist = await User.findOne({
        email: email
    });

    if(!exist){
        res.json({
            code: 400,
            message: "Email doesn't exist"
        });
        return;
    }

    const otp = generateHelper.generateRandomNumber(8);
    const timeExpire = 5;

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now() + timeExpire*60
    }

    // console.log(objectForgotPassword);
    const forgot = new forgotPassword(objectForgotPassword);
    await forgot.save();

    // Gửi OTP qua email user
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
    Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b> (Sử dụng trong ${timeExpire} phút).
    Vui lòng không chia sẻ mã OTP này với bất kỳ ai.
    `;

    sendMailHelper.sendMail(email, subject, html);


    res.json({
        code: 200,
        message: "Sent email"
    })
};

// [POST] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await forgotPassword.findOne({
        email: email,
        otp: otp
    });

    if(!result){
        res.json({
            code: 400,
            message: "Invalid OTP"
        });
        return;
    }

    const user = await User.findOne({email: email});

    const token = user.token;
    res.cookie("token", token);
    res.json({
        code: 200,
        message: "Authentication successfully",
        token: token
    });
};