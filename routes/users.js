const express = require('express')
const router = express.Router()
const User = require('../models/user')
const jwt_access = require('jsonwebtoken')
const jwt_refresh = require('jsonwebtoken')
const passport = require('passport')
const secret = require('../config/mongodb').secretOrKey

router.get("/test", (req, res) => {
    res.json({msg: "login works"})
})

router.post("/login", (req, res) => {
    const email = req.body.email
    const password = req.body.password
    User.findOne({'auths.appId': email})
        .then (user => {
            if (!user) {
                return res.status(404).json({msg:"用户不存在"})
            }
            if (user.passWord === password) {
                const rlue = {id: user.id, role: user.role}
                // jwt.sign("规则", "加密名字", "过期时间", "箭头函数")
                let accessToken, refreshToken
                jwt.sign(rlue, secret, {expiresIn: 3600}, (err, token) => {
                    if (err) throw err
                    accessToken = token
                })
                const longTime = 3600 * 24 * 30
                jwt_refresh.sign(rlue, secret, {expiresIn: longTime}, (err, token) => {
                    if (err) throw err
                    refreshToken = token
                    res.json({
                        success: true,
                        accessToken: "Bearer " + accessToken,
                        refreshToken: "Bearer " + refreshToken,
                    })
                })
            } 
            else {
                res.status(400).json({msg: "密码错误"})
            }
        })
})

router.get("/token", passport.authenticate("jwt", {session: false}), (req, res) => {
    res.json({msg: "success"})
})

module.exports = router