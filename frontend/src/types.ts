export type UserRegisterData = {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  lastName: string;
  firstName: string;
  address: string;
};

export type HomePageContent = {
  newestBooks: Book[];
  topBooks: Book[];
  booksOfTheMonth: Book[];
  booksOfTheWeek: Book[];
};

export type Category = {
  _id: string;
  name: string;
};

export type Book = {
  _id: string;
  title: string;
  image64: string;
  image?: object;
  description: string;
  publicationDate: number;
  price: number;
  rating: number;
  publisherName: string;
  authors: { _id: string; name: string }[];
  categories: Category[];
  numberOfPages: number;
};
export type CartBook = Omit<Book, 'image64' | 'image'> & { quantity: number };

export type User = {
  _id: string;
  username: string;
  email: string;
  name: string;
  address: string;
  isAdmin: boolean;
  isActive: boolean;
};

export type OrderDetails = {
  firstName: string;
  lastName: string;
  address: string;
  paymentMethod: string;
  shippingMethod: string;
};

export type ResponseMessage = {
  successfull: boolean;
  msg?: string;
  error?: string;
};
