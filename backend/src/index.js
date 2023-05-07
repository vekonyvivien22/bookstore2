const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');
const MongoStore = require('connect-mongo');
const moment = require('moment/moment');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3000;
const connectionUri = process.env.MONGODB_CONNECTION_URI;
const secret = process.env.SESSION_SECRET;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const whitelist = ['http://localhost:4200', 'http://localhost:3001'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Access-Control-Allow-Origin',
    'Origin',
    'Accept',
  ],
};
app.use(cors(corsOptions));

mongoose.connect(connectionUri);

mongoose.connection.on('connected', () => {
  console.log('succesfull db connect');
});

/*mongoose.connection.on('error', (error) => {
  console.log('error', error);
});*/

require('./schemas/book.schema');
require('./schemas/category.schema');
require('./schemas/store.schema');
require('./schemas/user.schema');
require('./schemas/order.schema');

const userModel = mongoose.model('user');

passport.use(
  'local',
  new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, async function (
    username,
    password,
    done,
  ) {
    try {
      const user = await userModel.findOne({ username });
      if (!user) return done(null, false);

      user.comparePasswords(password, function (error, isMatch) {
        if (error) return done(error, false);
        if (!isMatch) return done(null, false);
        return done(null, user);
      });
    } catch (err) {
      console.log(err);
      return done('Error during request.', null);
    }
  }),
);

passport.serializeUser((user, done) => {
  if (!user) return done('No user provid  ed', null);
  return done(null, user);
});

passport.deserializeUser((user, done) => {
  if (!user) return done('No user provided', null);
  return done(null, user);
});

app.use(
  expressSession({
    secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: connectionUri }),
    cookie: {
      maxAge: 1 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
//
// app.use(async function (req, res, next) {
//   const categories = await models.category.find();
//   const stores = await models.store.distinct('name');
//   res.locals = {
//     req,
//     categories,
//     stores,
//   };
//   next();
// });

app.use('/admin', require('./routes/admin.routes'));
app.use('/browse', require('./routes/browse.routes'));
app.use('/user', require('./routes/user.routes'));

const models = {
  book: mongoose.model('book'),
  category: mongoose.model('category'),
  store: mongoose.model('store'),
  order: mongoose.model('order'),
};

app.get('/home', async (_req, res) => {
  const newestBooks = await models.book.find().sort({ publicationDate: -1 }).limit(5);

  const topBooks = await models.book.find().sort({ rating: -1 }).limit(5);

  const ordersOfTheMonth = await models.order.find({
    $expr: {
      $and: [
        { $eq: [{ $month: '$createdAt' }, new Date().getMonth() + 1] },
        { $eq: [{ $year: '$createdAt' }, new Date().getFullYear()] },
      ],
    },
  });

  const ordersOfTheWeek = await models.order.find({
    createdAt: {
      $gte: moment().startOf('isoweek').toDate(),
      $lt: moment().endOf('isoweek').toDate(),
    },
  });

  function getTop3BookIds(param) {
    const map = new Map();
    const bookIds = [];
    for (var order in param) {
      for (const item of param[order].items) {
        //console.log(order + 'order -> ' + item.bookId + ' : ' + item.quantity);
        let prevQuantity = map.get(item.bookId);
        //console.log('Prev quantity -> ' + prevQuantity);
        map.set(item.bookId, prevQuantity ? prevQuantity + item.quantity : item.quantity);
      }
    }

    const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);

    for (let i = 0; i < 5; i++) {
      if (sorted[i]) bookIds.push(new mongoose.Types.ObjectId(sorted[i][0]));
    }

    return bookIds;
  }

  const booksOfTheMonth = await models.book.find({
    _id: { $in: getTop3BookIds(ordersOfTheMonth) },
  });
  const booksOfTheWeek = await models.book.find({
    _id: { $in: getTop3BookIds(ordersOfTheWeek) },
  });

  return res.json({
    newestBooks,
    topBooks,
    booksOfTheMonth,
    booksOfTheWeek,
  });
});

app.get('/categories', async (_req, res) => {
  const categories = await models.category.find();
  return res.json(categories);
});

app.get('/*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
