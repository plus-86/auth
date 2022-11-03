
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const { Schema } = mongoose

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true // 表示用户名是唯一值
    },
    password: {
        type: String,
        required: true,
        // setter 接受原来的密码，然后加密传给数据库
        set(val) {
            // 加密后传给数据库
            return bcrypt.hashSync(val, 10) //bcrypt.hashSync(要加密的密码:String, 加密强度:Number)
        }
    }
})

const User = mongoose.model('User', userSchema)
// model.db.dropCollection('集合名') 删除集合数据
// User.db.dropCollection('users')
module.exports = {
    User
}

