import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Item, Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable()
export class StockInventoryService {

  api: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.api}/products`);
  }

  
  getCart(): Observable<Item[]>{
    return this.http.get<Item[]>(`${this.api}/cart`);
  }
}
