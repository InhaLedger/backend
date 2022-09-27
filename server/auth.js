const User = require('../models/user')
const bcrypt = require('bcrypt.js')

const createUser = (userInput) => {
    const user = await encryptUser(userInput)
    return user.save()
}

const encryptUser = async ({
    userid,
    password,
    nickname
}) => {
    hashPW = await bcrypt.hash(password, 123)

    const user = new User({
        userid,
        password: hashPW,
        nickname
    })

    return user
}

const errorGenerator = (msg, statusCode = 500) => {
    error = new Error(msg)
    error.statusCode = statusCode
    throw error
}

const signUp = async (req, res, next) => {
    try {
        const {userid, password, nickname} = req.body
        const user = await User.findOne(userid)
        const nick = await User.findOne(nickname)

        if (user)
            errorGenerator('중복된 id 입니다.')
        if (nick)
            errorGenerator('중복된 닉네임입니다.')
        
        await createUser(req.body)
        res.status(201).json({msg:"Join Success!"})
    } catch (err){
        next(err)
    }
}

module.exports = signUp