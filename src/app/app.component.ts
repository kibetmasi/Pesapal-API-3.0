import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// const demoUrl = 'https://cybqa.pesapal.com/pesapalv3'
const demoUrl = '	https://pay.pesapal.com/v3'

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
  <div class="text">
  <a href="https://documenter.getpostman.com/view/6715320/UyxepTv1">API reference</a>
  </div>
    <div class="fullscreen-container">
      <div class="login-container">
        <h1>Pesapal API 3.0</h1>
          <form class="form" [formGroup]="form">
            <div class="input-group">
            <mat-form-field>
              <mat-label>Currency</mat-label>
              <mat-select formControlName="currency">
                <mat-option *ngFor="let cash of currencies" value="{{cash.value}}">{{cash.name}}</mat-option>
              </mat-select>
            </mat-form-field>
              <input formControlName="amount" type="number" placeholder="Amount" id="text" name="text" class="input-username"> 
            </div>        
            <div class="input-group">
              <textarea formControlName="description" placeholder="Description" id="password" name="password" class="input-password"></textarea>
            </div>      
            <input type="submit" placeholder="Make payment" class="button" [disabled]="!form.valid" (click)="getToken()">    
          </form>    
    </div>
  </div>
    <iframe *ngIf="iframe" [src]="iframe | safeUrl"></iframe>
`
})
export class AppComponent implements OnInit {
  form!:FormGroup
  demoKeys:any = {  //demo keys
    "consumer_key": "vssEbl/R5gzC/Lqu29nKF+UEMa0ppDzz",
    "consumer_secret": "fKbaakP8ZyRZUh+vbmvLlOxUHOs=" 
  }
  regIpn:any = {
    "url": "http://www.example.com",
    "ipn_notification_type": "GET"
  }
  currencies:any = [
    { "name":"Kenyan Shilling",  "value":"KES" },
    { "name":"US Dollar", "value":"USD" },
    { "name":"Euro", "value":"EUR" },
    { "name":"Great Britain Pound", "value":"GBP" },
    { "name":"Ugandan Shilling", "value":"UGX" },
    { "name":"Tanzanian Shilling", "value":"TZX" },
  ]
  iframe:any;
  constructor(
    private http: HttpClient, 
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      currency: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(100)]]
    })
  }

  getToken(){
    this.http.post(`${demoUrl}/api/Auth/RequestToken`, this.demoKeys) //generate access token
    .subscribe({
      next: (res:any) => {
        const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${res.token}`)
        this.http.post(`${demoUrl}/api/URLSetup/RegisterIPN`, this.regIpn, {headers: headers}).subscribe({ //get IPN
          next: (res:any) => {
            const order:any = {
              "id": Date.now().toString(36) + Math.random().toString(36).substring(2),
              "currency": this.form.getRawValue().currency,
              "amount": this.form.getRawValue().amount,
              "description": this.form.getRawValue().description,
              "callback_url": "http://localhost:4200",
              "notification_id": res.ipn_id,
              "billing_address": {
                  "email_address": "john.doe@example.com",
                  "phone_number": null,
                  "country_code": "",
                  "first_name": "John",
                  "middle_name": "",
                  "last_name": "Doe",
                  "line_1": "",
                  "line_2": "",
                  "city": "",
                  "state": "",
                  "postal_code": null,
                  "zip_code": null
            }}
            this.http.post(`${demoUrl}/api/Transactions/SubmitOrderRequest`, order, {headers:headers}) //payment request
            .subscribe({
              next: (res:any) => {
                this.iframe = res.redirect_url //load payment iframe
              },
              error: (error:any) => console.error(error)
            })
          }
        })
      },
      error: (err) => console.error(err)
    })
  }
}
