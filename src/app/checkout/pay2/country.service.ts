import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  constructor(private http: HttpClient) {}

  getCountries(): Observable<CountryModel[]> {
    return this.http.get<CountryModel[]>('assets/countries.json');
  }
}
export class CountryModel {
  countryName: string;
  cities: string[];
}
