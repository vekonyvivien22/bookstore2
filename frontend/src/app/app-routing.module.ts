import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';
import { BookComponent } from './book/book.component';
import { CartComponent } from './cart/cart.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'cat/:name',
    component: CategoryComponent,
  },
  {
    path: 'book/:id',
    component: BookComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
