import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartForm: FormGroup = new FormGroup({
    firstName: new FormControl('', {
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      validators: [Validators.required],
    }),
    address: new FormControl('', {
      validators: [Validators.required],
    }),
    paymentMethod: new FormControl('credit card', {
      validators: [Validators.required],
    }),
    shippingMethod: new FormControl('store pickup', {
      validators: [Validators.required],
    }),
  });

  constructor(
    public cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCartFromLocalStorage();
  }

  order() {
    this.cartService.placeOrder(this.cartForm.value).subscribe({
      next: (res) => {
        if (res.status == 200 && res.body?.successfull) {
          this.cartService.emptyCart();
          this.snackBar.open(res.body.msg!, 'Cancel', { duration: 3000 });
          this.router.navigateByUrl('/');
        } else {
          this.snackBar.open(res.body?.error!, 'Cancel');
        }
      },
      error: (error) => {
        this.snackBar.open(error.error.error, 'Cancel');
      },
    });
    console.log(this.cartForm.value);
  }
}
