import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Book } from 'src/types';
import { AppService } from '../app.service';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['index', 'title', 'rating', 'price', 'actions'];
  dataSource = new MatTableDataSource<Book>();
  loading = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCategories(this.route.snapshot.params['name']);
    this.router.events.subscribe({
      next: (event) => {
        this.loading = true;
        if (event instanceof NavigationEnd) {
          this.loadCategories(this.route.snapshot.params['name']);
        }
      },
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filterTable(event: KeyboardEvent) {
    const inputField = event.target as HTMLInputElement | null;
    if (inputField)
      this.dataSource.filter = inputField.value.trim().toLowerCase();
  }

  loadCategories(name: string) {
    this.loading = true;
    this.appService.getBooksOfCategory(name).subscribe({
      next: (res) => {
        if (res) {
          this.dataSource.data = res;
          this.loading = false;
        }
      },
    });
  }

  addToCart(book: Book) {
    this.cartService.addToCart(book);
    this.snackBar.open(`"${book.title}" has been added to the cart`, 'Cancel', {
      duration: 3000,
    });
  }
}
