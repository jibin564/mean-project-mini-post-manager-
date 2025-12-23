const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/signup",(req,res,next)=>{
    bcrypt.hash(req.body.password,10).then(hash =>{
    const user = new User({
        email:req.body.email,
        password:hash
    });
      user.save().then(result =>{
        res.status(201).json({
            message:"User created",
            result:result
          });
      }).catch(err=>{
        res.status(500).json({
            error:err
        });
      });
        });

    });

    router.post("/login",(req,res,next)=>{
        let fetchedUser;
        User.findOne({email:req.body.email}).then(user =>{
            if(!user){
                return Promise.reject("AUTH_FAILED");
            }
            fetchedUser = user;
           return bcrypt.compare(req.body.password,user.password);

            }).then(result =>{
                if(!result){
                    return Promise.reject("AUTH_FAILED");
                }
                const token = jwt.sign({email:fetchedUser.email,userId:fetchedUser._id},process.env.JWT_SECRET,{expiresIn:"1h"});
                res.status(200).json({
                    token:token,
                    expiresIn:3600,
                    userId:fetchedUser._id
                });
            }).catch(err=>{
                if(err === "AUTH_FAILED"){
                    return res.status(401).json({
                        message:"Auth failed"
                    });
                }
                console.log(err);
                return res.status(500).json({
                    message:"Login failed. Please try again later."
                });
            });
        })




module.exports = router;
