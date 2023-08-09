import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ToramapayService {

  baseurl = environment.baseUrl;
  api = "/api/toramapay/";

  constructor(private http: HttpClient) { }

  initiateCheckout() {
    // return fetch(this.baseurl + this.api + "initiate-checkout", {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({})
    // });
    return this.http.post(this.baseurl + this.api + "initiate-checkout", {});

  }
}
