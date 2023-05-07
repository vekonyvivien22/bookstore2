import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { NgxFlickingModule } from '@egjs/ngx-flicking';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CategoryComponent } from './category/category.component';
import { BookComponent } from './book/book.component';
import { PluckPipe } from './pipes/pluck.pipe';
import { CartComponent } from './cart/cart.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CategoryComponent,
    BookComponent,
    PluckPipe,
    CartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    NgxFlickingModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
