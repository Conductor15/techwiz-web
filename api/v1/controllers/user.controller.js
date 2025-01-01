const md5 = require("md5");
const User = require("../models/user.model")

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