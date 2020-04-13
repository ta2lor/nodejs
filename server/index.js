const bodyparser = require('body-parser')
const express = require('express')
const app = express()
const port = 5000

const cookieParser = require('cookie-parser')
const config = require('./config/key')
app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());
app.use(cookieParser())
const { User } = require('./models/User')
const { auth } = require('./middleware/auth')
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,
 {useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify : true}
).then(() => console.log('mongodb connected'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('hello World!'))

app.post('/api/users/register', (req, res) =>{
    //회원가입할때 필요한 정보들을 클라이언트에서 가져오면
    //그것들을데이터베이스에 넣어준다.

    const user = new User(req.body)
    user.save((err, userInfo) => {
        if(err) return res.json({ success :"회원가입에 실패함", err})
        return res.status(200).json({                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
            success : true
        })
    })
})

app.post('/api/users/login', (req, res) => {
    //요청된 이메일을 데이터베이스에서 있는지 찾는다
    User.findOne({email : req.body.email} ,(err,user) => {
        if(!user){
            return res.json({
                loginSuccess : false,
                message : "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        
        //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인한다
        user.comparePassword(req.body.password, (err, isMatch) => {
            
            if(!isMatch){
                return res.json( {loginSuccess :false, message : "비밀번호가 틀렸습니다." })           
                
            }
            //비밀번호까지 맞다면 토큰을 생성한다.
            user.generateToken((err, user) =>{
                if(err) return res.json( { loginSuccess : false, message : "토큰이 생성되지 않았습니다."})
                
                //토큰을 저장한다. 쿠키,로컬스토리지에 저장가능
                res.cookie('x_auth', user.token)
                .status(200) 
                .json({loginSuccess : true, userId : user._id})
            })
        })
    })
})


app.get('/api/users/auth', auth, (req, res) => {
    //여기까지 왔다는 것은 미들웨어를 통과했고 그건 auth를 통과한거
    res.status(200).json({
        _id : req.user._id,
        isAdmin : req.user.role === 0 ? false : true,
        isAuth : true,
        email : req.user.email,
        name : req.user.name,
        lastname : req.user.lastname,
        role : req.user.role,
        image : req.user.image
    })
})


app.get('/api/users/logout', auth, (req , res) => {
    User.findOneAndUpdate({_id : req.user._id},
        {token : ""},
        (err, user) => {
            if(err) return res.json({success: false, err});
            return res.status(200).send({
                success: true
            })
        })
})

app.get('/api/hello', (req, res) =>{
    res.send("hello react")
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))