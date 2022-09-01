import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const demoUrl = 'https://cybqa.pesapal.com/pesapalv3'

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <div class="fullscreen-container">
      <div class="login-container">
        <h1>Pesapal API</h1>
          <form class="form" [formGroup]="form">
            <div class="input-group">
              <input formControlName="amount" type="number" placeholder="Amount" id="text" name="text" class="input-username"> 
            </div>        
            <div class="input-group">
              <textarea formControlName="description" placeholder="Description" id="password" name="password" class="input-password"></textarea>
            </div>      
            <input placeholder="Make payment" class="button" [disabled]="!form.valid" (click)="getToken()">    
          </form>    
    </div>
  </div>
    <iframe *ngIf="iframe" [src]="iframe | safeUrl"></iframe>
`
})
export class AppComponent implements OnInit {
  form!:FormGroup
  demoKeys:any = { 
    "consumer_key": "vssEbl/R5gzC/Lqu29nKF+UEMa0ppDzz",
    "consumer_secret": "fKbaakP8ZyRZUh+vbmvLlOxUHOs=" 
  }
  regIpn:any = {
    "url": "http://www.example.com",
    "ipn_notification_type": "GET"
  }
  token:any;
  iframe:any;
  constructor(
    private http: HttpClient, 
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      currency: ['KES', [Validators.required]],
      amount: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(100)]]
    })
  }

  getToken(){
    this.http.post(`${demoUrl}/api/Auth/RequestToken`, this.demoKeys) //generate access token
    .subscribe({
      next: (res:any) => {
        this.token = res.token
        const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${this.token}`)
        this.http.post(`${demoUrl}/api/URLSetup/RegisterIPN`, this.regIpn, {headers: headers}).subscribe({ //get IPN
          next: (res:any) => {
            const order:any = 
            {
              "id": "TEST1515111110",
              "currency": this.form.getRawValue().currency,
              "amount": this.form.getRawValue().amount,
              "description": this.form.getRawValue().description,
              "callback_url": "https://www.example.com/payment-confirmed",
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
              }
            })
          }
        })
      },
      error: (err) => console.error(err)
    })
  }
}
