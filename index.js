
const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://taylor:k1k1k1@ta2-fcfwt.mongodb.net/test?retryWrites=true&w=majority',
 {useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify : true}
).then(() => console.log('mongodb connected'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! guys'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))