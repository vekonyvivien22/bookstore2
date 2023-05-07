const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: {
      data: { type: Buffer },
      contentType: { type: String },
    },
    description: { type: String, required: true },
    publicationDate: { type: Number, required: true, max: 2023 },
    // size: { type: Number, required: true },
    numberOfPages: { type: Number, required: true },
    // binding: {type: Number, required: true},
    price: { type: Number, required: true },
    rating: { type: Number, required: false },
    publisherName: { type: String, required: true },
    authors: [
      new mongoose.Schema({
        name: { type: String, required: true },
      }),
    ],
    categories: [
      new mongoose.Schema({
        name: { type: String, required: true },
      }),
    ],
  },
  {
    collection: 'books',
    timestamps: { createdAt: true, updatedAt: true },
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

bookSchema.virtual('image64').get(function () {
  return this.image && this.image?.contentType && Object.keys(this.image).length > 0
    ? 'data:image/' +
        this.image?.contentType?.split('/')[1] +
        ';base64,' +
        this.image?.data?.toString('base64') ?? ''
    : null;
});

mongoose.model('book', bookSchema);
