import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Book, CartBook, ResponseMessage, OrderDetails } from 'src/types';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  books: CartBook[] = [];
  totalPrice = 0;

  constructor(private http: HttpClient) {}

  addToCart(book: Book) {
    const bookIndex = this.books.findIndex((b) => book._id === b._id);
    const { image, image64, ...b } = book;
    if (bookIndex > -1) {
      this.books[bookIndex].quantity += 1;
    } else {
      this.books.push({ ...b, quantity: 1 });
    }
    this.totalPrice += book.price;
    this.updateCart();
  }

  increaseQuantity(bookId: string) {
    const bookIndex = this.books.findIndex((b) => bookId === b._id);
    if (bookIndex > -1) this.books[bookIndex].quantity += 1;
    this.totalPrice += this.books[bookIndex].price;
    this.updateCart();
  }

  decreaseQuantity(bookId: string) {
    const bookIndex = this.books.findIndex((b) => bookId === b._id);
    if (bookIndex > -1) {
      this.totalPrice -= this.books[bookIndex].price;
      if (this.books[bookIndex].quantity === 1) {
        this.books = this.books.filter((book) => bookId !== book._id);
      } else {
        this.books[bookIndex].quantity -= 1;
      }
    }
    this.updateCart();
  }

  removeFromCart(product: CartBook): void {
    const index = this.books.indexOf(product);
    if (index > -1) {
      this.books.splice(index, 1);
      // this.updateCart(this.books);
      this.totalPrice -= product.price;
    }
  }

  emptyCart(): void {
    this.books = [];
    this.totalPrice = 0;
    this.updateCart();
  }

  getCartFromLocalStorage() {
    const cart = localStorage.getItem('cart');
    const totalPrice = localStorage.getItem('totalPrice');
    if (cart && totalPrice) {
      this.books = JSON.parse(cart);
      this.totalPrice = +totalPrice;
    } else {
      this.books = [];
      this.totalPrice = 0;
    }
  }

  getCart() {
    this.getCartFromLocalStorage();
    return {
      books: this.books,
      totalPrice: this.totalPrice,
    };
  }

  /* Save cart to localStorage. */
  updateCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.books));
    localStorage.setItem('totalPrice', JSON.stringify(this.totalPrice));
  }

  placeOrder(orderDetails: OrderDetails) {
    this.getCartFromLocalStorage();
    return this.http.post<ResponseMessage>(
      environment.serverUrl + '/user/order',
      { totalPrice: this.totalPrice, cart: this.books, ...orderDetails },
      {
        withCredentials: true,
        responseType: 'json',
        observe: 'response',
      }
    );
  }

  /* Get all user related order from java backend. */
  // getOrders(userId: string): Observable<OrderDetails[]> {
  //   return this.http.get<OrderDetails[]>(
  //     environment.springServerUrl + 'orders',
  //     {
  //       responseType: 'json',
  //       params: {
  //         user_id: userId,
  //       },
  //     }
  //   );
  // }
}
