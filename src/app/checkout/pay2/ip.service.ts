import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IpService {
  constructor(private http: HttpClient) {}

  getIpAddress(): Observable<any> {
    // ipify API to get public IP
    return this.http.get('https://api.ipify.org?format=json');
  }
}
