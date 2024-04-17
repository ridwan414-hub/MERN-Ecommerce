const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const userRouter = require('./routers/userRouter');
const seedRouter = require('./routers/seedRouter');
const { errorResponse } = require('./controllers/responseController');
const authRouter = require('./routers/authRouter');
const categoryRouter = require('./routers/categoryRouter');
const productRouter = require('./routers/productRouter');


const app = express();

const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 15,
    message: 'Rate limit exceeded'
})

app.use(cookieParser())
app.use(rateLimiter)
app.use(xssClean());
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/seed', seedRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/products', productRouter)

app.get('/', (req, res) => {
    res.status(200).send({ message: 'Hello world' })
})


app.use((req, res, next) => {
    next(createError(404, 'route not found'))
})

app.use((err, req, res, next) => {
    return errorResponse(res, {
        statusCode: err.status,
        message: err.message
    })
})
module.exports = app