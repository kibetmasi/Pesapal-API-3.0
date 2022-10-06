import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Address, Callback, MoneyOptons, IForm } from './data';

const demoUrl = 'https://cybqa.pesapal.com/pesapalv3'
// const demoUrl = '	https://pay.pesapal.com/v3'

interface IFormGroup extends FormGroup {
  value: IForm
  controls: {
    currency: FormControl,
    amount: FormControl,
    description: FormControl
  }
}

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
  <div class="text">
  <a target="_blank" href="https://documenter.getpostman.com/view/6715320/UyxepTv1">API reference</a>
  </div>
    <div class="fullscreen-container"s>
      <div class="login-container">
        <h4>Payment page Integration</h4>
          <form class="form" [formGroup]="form" (ngSubmit)="getToken()">
            <div class="input-group">
            <mat-form-field>
              <mat-label>Currency</mat-label>
              <mat-select [formControl]="form.controls.currency">
                <mat-option *ngFor="let cash of options" value="{{cash.value}}">{{cash.name}}</mat-option>
              </mat-select>
            </mat-form-field>
              <input [formControl]="form.controls.amount" type="number" 
              placeholder="Amount" id="text" name="text" class="input-username"> 
            </div>        
            <div class="input-group">
              <textarea [formControl]="form.controls.description" 
              placeholder="Description" id="password" name="password" class="input-password">
              </textarea>
            </div>      
            <input type="submit" placeholder="Make payment" class="button" [disabled]="!form.valid || form.getRawValue().amount <= 0" > 
            <h6 
              [style.color]="'red'" 
              *ngIf="form.getRawValue()?.amount <= 0 && form.get('amount')?.touched">
              Amount should be greater than 0
            </h6>   
          </form>    
    </div>
  </div>
    <iframe *ngIf="iframe" [src]="iframe | safeUrl"></iframe>
`
})

export class AppComponent implements OnInit {
  paymentData!: IForm
  form!:IFormGroup
  main_form!:IForm
  iframe:any;
  demoKeys:any = {  //demo keys
    "consumer_key": "vssEbl/R5gzC/Lqu29nKF+UEMa0ppDzz",
    "consumer_secret": "fKbaakP8ZyRZUh+vbmvLlOxUHOs=" 
  }

  regIpn:any = {
    "url": "http://www.example.com",
    "ipn_notification_type": "GET"
  }

  options: MoneyOptons[] = [
    { name:"Kenyan Shilling",  value:"KES" },
    { name:"US Dollar", value:"USD" },
    { name:"Euro", value:"EUR" },
    { name:"Great Britain Pound", value:"GBP" },
    { name:"Ugandan Shilling", value:"UGX" },
    { name:"Tanzanian Shilling", value:"TZX" },
  ] 
  
  constructor(
    private http: HttpClient, 
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this['form'] = this.formBuilder.group({
      currency: ['', [Validators.required]],
      amount: ['', [Validators.required] ],
      description: ['',[Validators.required, Validators.maxLength(256), Validators.minLength(10)] ]
    }) as IFormGroup
    this['form'].patchValue(this.paymentData)
  }

  castToAbstractControl(control:any) {
    return control as FormControl;
  }

  getToken(){
    this['http'].post(`${demoUrl}/api/Auth/RequestToken`, this.demoKeys) //generate access token
    .subscribe({
      next: (res:any) => {
        const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${res.token}`)
        this['http'].post(`${demoUrl}/api/URLSetup/RegisterIPN`, this['regIpn'], {headers: headers}).subscribe({ //get IPN
          next: (res:any) => {
            const order:any = {
              "id": Date.now().toString(36) + Math.random().toString(36).substring(2),
              "currency": this.form.getRawValue().currency,
              "amount": this.form.getRawValue().amount,
              "description": this.form.getRawValue().description,
              "callback_url": Callback.callback_url,
              "notification_id": res.ipn_id,
              "billing_address": {
                  "email_address": Address.email_address,
                  "phone_number": Address.phone_number,
                  "country_code": Address.country_code,
                  "first_name": Address.first_name,
                  "middle_name": Address.middle_name,
                  "last_name": Address.last_name,
                  "line_1": Address.line_1,
                  "line_2": Address.line_2,
                  "city": Address.city,
                  "state": Address.state,
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
          }, error: (err:any) => console.error(err)
        })
      },
      error: (err) => console.error(err)
    })
  }
}
