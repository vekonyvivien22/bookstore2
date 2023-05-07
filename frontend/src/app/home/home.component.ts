import { Component, OnInit } from '@angular/core';
import { Plugin } from '@egjs/ngx-flicking';
import { Fade, AutoPlay, Arrow } from '@egjs/flicking-plugins';
import { AppService } from '../app.service';
import { Book } from 'src/types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.css',
    '../../../node_modules/@egjs/flicking-plugins/dist/arrow.css',
  ],
})
export class HomeComponent implements OnInit {
  newestBooks: Book[];
  topBooks: Book[];
  booksOfTheMonth: Book[];
  booksOfTheWeek: Book[];

  loading = false;

  constructor(private appService: AppService) {}

  plugins1: Plugin[] = [
    new AutoPlay({
      duration: 2000,
      direction: 'NEXT',
    }),
    new Arrow(),
    new Fade(),
  ];
  plugins2: Plugin[] = [
    new AutoPlay({
      duration: 2000,
      direction: 'NEXT',
    }),
    new Arrow(),
    new Fade(),
  ];
  plugins3: Plugin[] = [
    new AutoPlay({
      duration: 2000,
      direction: 'NEXT',
    }),
    new Arrow(),
    new Fade(),
  ];
  plugins4: Plugin[] = [
    new AutoPlay({
      duration: 2000,
      direction: 'NEXT',
    }),
    new Arrow(),
    new Fade(),
  ];

  ngOnInit() {
    this.loading = true;
    this.appService.getHomeData().subscribe({
      next: (res) => {
        const data = res.body;
        if (data) {
          this.booksOfTheWeek = data.booksOfTheWeek;
          this.topBooks = data.topBooks;
          this.booksOfTheMonth = data.booksOfTheMonth;
          this.newestBooks = data.newestBooks;
          this.loading = false;
        }
      },
    });
  }
}
