import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { BasketModel, ProductModel } from "./product.model";

@Injectable({
  providedIn: "root",
})
export class KadirProductService {
  private basket$ = new BehaviorSubject<BasketModel[]>([]);
  basketNew$ = this.basket$.asObservable();

  constructor(private httpClient: HttpClient) {}

  setCartList() {
    this.basket$.next(JSON.parse(localStorage.getItem("basket")!));
  }
  getProducts(): Observable<ProductModel[]> {
    return this.httpClient.get<ProductModel[]>("assets/products-1.json");
  }
}

export class Observe<T> {
  model: T;
  name: string;
  address: string;
}
