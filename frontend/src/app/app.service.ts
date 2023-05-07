import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Book, Category, HomePageContent } from 'src/types';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}

  getHomeData() {
    return this.http.get<HomePageContent>(environment.serverUrl + '/home', {
      withCredentials: false,
      responseType: 'json',
      observe: 'response',
    });
  }

  getCategories() {
    return this.http
      .get<Category[]>(environment.serverUrl + '/categories', {
        withCredentials: false,
        responseType: 'json',
        observe: 'response',
      })
      .pipe(
        map((res) => {
          return res.body;
        })
      );
  }

  getBooksOfCategory(name: string) {
    return this.http
      .get<Book[]>(environment.serverUrl + `/browse/cat/${name}`, {
        withCredentials: false,
        responseType: 'json',
        observe: 'response',
      })
      .pipe(
        map((res) => {
          return res.body?.map((book, index) => ({
            index: index + 1,
            ...book,
          }));
        })
      );
  }

  getBook(id: string) {
    return this.http
      .get<{ book: Book; storeStock: any; recommendedBooks: any[] }>(
        environment.serverUrl + `/browse/book/${id}`,
        {
          withCredentials: false,
          responseType: 'json',
          observe: 'response',
        }
      )
      .pipe(
        map((res) => {
          return res.body;
        })
      );
  }
}
