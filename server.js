require('dotenv').config()
const { User } = require('./models')
const express = require('express')
const exp = require('constants')
const app = express()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const PORT = process.env.PORT || 3000
const SECRET = process.env.SECRET

app.use(express.json()) // 解析客户端发来的json格式数据



app.get('/api/users', async (req, res) => {
    // model.find() 查找所有模型数据
    let users = await User.find({})
    res.send(users)
})

app.post('/api/register', async (req, res) => {
    let { body: { username, password } } = req
    // model.create({data1,data2}) 创建一条模型数据到数据
    const user = await User.create({
        username,
        password
    })
    res.send(user)
})

app.post('/api/login', async (req, res) => {
    let { body: { username, password } } = req
    const user = await User.findOne({
        username
    })
    // 如果用户不存在，返回状态码422表示无法处理的实体，再发送一个包含信息的对象给用户
    if (!user) return res.status(422).send({
        message: '用户名不存在'
    })
    // 用客户端发来的明文密码和数据库的密文密码做对比
    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) return res.status(422).send({
        message: '密码错误'
    })
    // 登录成功
    // 用_id生成token
    const token = jwt.sign({
        id: String(user._id)
    }, SECRET)
    res.send({ user, token })
})

const authMiddleware = async (req, res, next) => {
    const tokenFromClient = String(req.headers.authorization).split(' ').pop()
    const { id } = jwt.verify(tokenFromClient, SECRET)
    req.user = await User.findById(id)
    next()
}

app.get('/api/profile', authMiddleware, async (req, res) => {
    res.send(req.user)
})

app.listen(PORT, () => {
    console.log(`Node is listening port ${PORT}...`);
})

