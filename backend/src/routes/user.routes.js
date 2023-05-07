const express = require('express');
const { default: mongoose } = require('mongoose');
const passport = require('passport');
var Cart = require('../schemas/cart');

const models = {
  category: mongoose.model('category'),
  store: mongoose.model('store'),
  user: mongoose.model('user'),
  book: mongoose.model('book'),
  order: mongoose.model('order'),
};

const router = express.Router();

router.route('/is-authenticated').get((req, res) => {
  return res.status(200).send(req.isAuthenticated() ? true : false);
});

router.route('/login').post(async (req, res, next) => {
  const { username, password } = req.body;

  if (username && password) {
    passport.authenticate('local', (err, user) => {
      if (err) {
        return res.status(500).send({ successfull: false, error: 'Internal server error.' });
      }

      req.logIn(user, async (err) => {
        if (err) {
          return res.status(500).send({
            successfull: false,
            error: 'There is no user with this username or the password is wrong.',
          });
        }
        req.session.save();
        return res.status(200).send({
          successfull: true,
          msg: 'Successfully loged in.',
          user,
        });
      });
    })(req, res, next);
  } else {
    return res.status(400).send({
      successfull: false,
      error: 'False request, username or password not provided.',
    });
  }
});

router.route('/reg').post(async (req, res) => {
  const { passwordConfirmation, firstName, lastName, ...body } = req.body;

  if (body.password === passwordConfirmation) {
    try {
      const user = await models.user.findOne({ email: req.body.email });
      if (user)
        return res.status(400).send({
          successfull: false,
          error: 'A user with this email is already exists.',
        });

      const newUser = new models.user({
        ...body,
        name: {
          firstName,
          lastName,
        },
      });
      await newUser.save();
      return res.status(200).send({ successfull: true, msg: 'Successfull registration.' });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ successfull: false, error: 'Registration failed.' });
    }
  } else {
    return res
      .status(400)
      .send({ successfull: false, error: 'The two given passwords do not match.' });
  }
});

router.route('/logout').post((req, res) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) {
        return res.status(500).send({ successfull: false, error: 'Internal server error.' });
      }
      return res.status(200).send({ successfull: true, msg: 'Successfull logout.' });
    });
  } else {
    return res.status(403).send({ successfull: false, error: 'No user was logged in.' });
  }
});

router.route('/order').post(async (req, res) => {
  const { cart, totalPrice, address, firstName, lastName, shippingMethod, paymentMethod } =
    req.body;

  try {
    const newOrder = new models.order({
      userID: req.user._id,
      paymentMethod,
      shippingName: {
        firstName,
        lastName,
      },
      shippingMethod,
      shippingAddress: address,
      total: totalPrice,
      items: cart.map((book) => ({
        bookId: book._id,
        quantity: book.quantity,
      })),
    });
    await newOrder.save();
  } catch (error) {
    console.error(error);
    return res.status(500).send({ successfull: false, error: 'Internal server error.' });
  }

  return res.status(200).send({ successfull: true, msg: 'Order sucessfull' });
});

module.exports = router;
