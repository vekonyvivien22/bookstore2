const express = require('express');
const { default: mongoose } = require('mongoose');
const Multer = require('multer');

const models = {
  book: mongoose.model('book'),
  category: mongoose.model('category'),
  store: mongoose.model('store'),
  user: mongoose.model('user'),
};

const router = express.Router();

router.route('/is-admin').get((req, res, next) => {
  return res.status(200).send(req.isAuthenticated() && req.user.isAdmin ? true : false);
});

router.route('/').get(async (req, res) => {
  const books = await models.book.find();
  const users = await models.user.find();
  const regUsers = await models.user.find({ 'regularUser.isRegular': true });

  return res.json({
    books,
    users,
    regUsers,
  });
});

router.route('/manageBooks').get(async (_req, res) => {
  const books = await models.book.find();
  const users = await models.user.find();
  return res.json({
    books,
    users,
  });
});

router.route('/manageUsers').get(async (_req, res) => {
  const books = await models.book.find();
  const users = await models.user.find();
  return res.json({
    books,
    users,
  });
});

//CREATE BOOK
router
  .route('/createBook')
  .post(Multer({ storage: Multer.memoryStorage() }).single('image'), async (req, res) => {
    const {
      title,
      description,
      publicationDate,
      numberOfPages,
      price,
      rating,
      publisherName,
      authors,
      categories,
    } = req.body;
    //console.log(req.body);
    //console.log(req.file.originalname);
    let error;
    let newBook;

    if (!req.file) {
      newBook = new models.book({
        title,
        description,
        publicationDate,
        numberOfPages,
        price,
        rating,
        publisherName,
        authors: authors.split(',').map((author) => {
          return { name: author };
        }),
        categories: categories.split(',').map((category) => ({
          name: category,
        })),
      });
    } else {
      newBook = new models.book({
        title,
        description,
        image: {
          data: req.file.buffer,
          contentType: `image/${req.file.originalname.split('.').slice(-1)}`,
        },
        publicationDate,
        numberOfPages,
        price,
        rating,
        publisherName,
        authors: authors.split(',').map((author) => {
          return { name: author };
        }),
        categories: categories.split(',').map((category) => ({
          name: category,
        })),
      });
    }

    try {
      await newBook.save();
      return res.status(200).send({
        successfull: true,
        msg: 'Successfully added book.',
      });
    } catch (err) {
      return res
        .status(500)
        .send({ successfull: false, error: 'Error: cannot add book to database.' });
    }
  });

//CREATE CATEGORY
router.route('/createCategory').post(async (req, res) => {
  const { name } = req.body;
  const newCat = new models.category({
    name,
  });

  try {
    await newCat.save();
    return res.status(200).send({
      successfull: true,
      msg: 'Successfully added category.',
    });
  } catch (err) {
    return res
      .status(500)
      .send({ successfull: false, error: 'Error: cannot add category to database.' });
  }
});

// CREATE STORE
router.route('/createStore').post(async (req, res) => {
  const { name, location, storeStock } = req.body;
  const asd = storeStock.split(';').map((book) => {
    const [bookId, quantity] = book.split(',');
    return { bookId, quantity };
  });
  console.log(asd);
  const newStore = new models.store({
    name,
    location,
    storeStock: asd,
  });

  try {
    await newStore.save();
    return res.status(200).send({
      successfull: true,
      msg: 'Successfully added category.',
    });
  } catch (err) {
    return res
      .status(500)
      .send({ successfull: false, error: 'Error: cannot add category to database.' });
  }
});

router.route('/delUser/:id').get(async (req, res) => {
  const id = req.params.id;

  try {
    await models.user.deleteOne({ _id: id });
    return res.status(200).send({
      successfull: true,
      msg: 'Successfully deleted user',
    });
  } catch (err) {
    return res.status(500).send({ successfull: false, error: 'Error: cannot delete user.' });
  }
});

router.route('/delBook/:id').get(async (req, res) => {
  const id = req.params.id;

  try {
    await models.book.deleteOne({ _id: id });
    await models.store.updateMany({ $pull: { storeStock: { bookId: id } } });
    return res.status(200).send({
      successfull: true,
      msg: 'Successfully deleted book',
    });
  } catch (err) {
    return res.status(500).send({ successfull: false, error: 'Error: cannot delete book.' });
  }
});

router.route('/modUser').post(async (req, res) => {
  const { username, discount } = req.body;

  username.forEach(async function (value, i) {
    const user = await models.user.findOne({
      username: value,
      'regularUser.discount': discount[i],
    });

    if (!user) {
      try {
        await models.user.updateOne(
          { username: value },
          { $set: { 'regularUser.discount': discount[i] } },
        );
      } catch (error) {
        return res.status(500).send({ successfull: false, error: 'Error: cannot delete book.' });
      }
    }
  });
  return res.status(200).send({
    successfull: true,
    msg: 'Successfully updated user',
  });
});

module.exports = router;
