import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from 'src/types';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { CartService } from './cart/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Bookstore';
  numberOfBooksInCart = 0;

  categories$: Observable<Category[] | null>;

  constructor(
    public authService: AuthService,
    private appService: AppService,
    public cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  async ngOnInit() {
    this.categories$ = this.appService.getCategories();
    this.cartService.getCartFromLocalStorage();
    /*
     * Check if user object exists in localStorage.
     * If exists, check if that user is authenticated on the server.
     */
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    if (user) {
      const isAuthenticated = await this.authService.checkAuthenticated();
      if (!isAuthenticated) {
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        this.router.navigateByUrl('/auth/login');
      } else {
        this.authService.user = user;
      }
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (res) => {
        if (res.status === 200 && res.body.successfull) {
          this.snackBar.open(res.body.msg, 'Cancel', { duration: 3000 });
          localStorage.removeItem('user');
          this.authService.user = null;
          this.router.navigateByUrl('/');
        }
      },
      error: (error) => {
        console.log(error);
        this.snackBar.open(error.error.error, 'Cancel', { duration: 3000 });
      },
    });
  }
}
