import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/types';
import { AppService } from '../app.service';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent implements OnInit {
  loading = false;
  book: Book;

  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loading = true;
    this.appService.getBook(this.route.snapshot.params['id']).subscribe({
      next: (res) => {
        if (res) {
          res.book.authors.map((author) => author.name).join(', ');
          delete res.book.image;
          this.book = res.book;
          this.loading = false;
        }
      },
    });
  }

  addToCart() {
    this.cartService.addToCart(this.book);
    this.snackBar.open(
      `"${this.book.title}" has been added to the cart`,
      'Cancel',
      {
        duration: 3000,
      }
    );
  }
}
