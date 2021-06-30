const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const cors = require('cors');
//const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const userRouter = require('./routes/userRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//middlewares

app.use(cors());

app.options('*', cors());

//app.use('/img/*', authController.protect);
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));

app.use(xss());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(cookieParser());

//Routes
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

//Server
module.exports = app;
