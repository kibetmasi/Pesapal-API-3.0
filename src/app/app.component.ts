import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Address, Callback, MoneyOptons, IForm } from './data';


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
    <div class="fullscreen-container">
        <div class="login-container">
            <h4 [style.font-weight]="'bold'">Pesapal API 3.0</h4>
            <section class="example-section">
                <label class="example-margin">Environment:</label>
                <mat-radio-group>
                    <mat-radio-button (change)="onEnvChanged($event)" 
                    class="example-margin" [value]="'https://cybqa.pesapal.com/pesapalv3'">
                        Sandbox
                    </mat-radio-button>
                    <mat-radio-button (change)="onEnvChanged($event)" 
                    class="example-margin" [value]="'https://pay.pesapal.com/v3'">
                        Live
                    </mat-radio-button>
                </mat-radio-group>
                <h5 [style.color]="'red'" *ngIf="!demoUrl">
                Select the environment before proceeding
                </h5>
            </section>
            <div [ngStyle]="{'pointer-events' : !demoUrl ? 'none' : 'all'}">
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
                    <input type="submit" placeholder="Make payment" class="button" 
                    [disabled]="!form.valid 
                    || form.getRawValue().amount <= 0 
                    || !demoUrl">
                    <h6 [style.color]="'red'" 
                    *ngIf="form.getRawValue()?.amount <= 0 && form.get('amount')?.touched">
                        Amount should be greater than 0
                    </h6>
                </form>
            </div>
        </div>
    </div>
    <div class="iframe_show">
        <iframe *ngIf="iframe" [src]="iframe | safeUrl"></iframe>
    </div>
`
})

export class AppComponent implements OnInit {
  demoUrl:any
  paymentData!: IForm
  form!:IFormGroup
  main_form!:IForm
  iframe:any;
  keys:any = {  //demo keys
    "consumer_key": "",
    "consumer_secret": "" 
  }

  regIpn:any = {
    "url": "http://www.example.com",
    "ipn_notification_type": "GET"
  }

  options: MoneyOptons[] = [
    { name:"Kenyan Shilling", value:"KES" },
    { name:"US Dollar", value:"USD" },
    { name:"Euro", value:"EUR" },
    { name:"Great Britain Pound", value:"GBP" },
    { name:"Ugandan Shilling", value:"UGX" },
    { name:"Tanzanian Shilling", value:"TZX" },
  ] 
  
  constructor(
    private http: HttpClient, 
    private snack: MatSnackBar,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this['form'] = this.formBuilder.group({
      currency: ['', [Validators.required]],
      amount: ['', [Validators.required] ],
      description: ['',[ Validators.required, Validators.maxLength(256)] ]
    }) as IFormGroup
    this['form'].patchValue(this.paymentData)
  }

  castToAbstractControl(control:any) {
    return control as FormControl;
  }

  // get the environment endpoint
  onEnvChanged(event:any){
    this.demoUrl = event.value;
  }

  getToken(){
    this['http']['post'](`${this['demoUrl']}/api/Auth/RequestToken`, this.keys) //generate access token
    .subscribe({
      next: (res:any) => {
        const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${res['token']}`)
        this['http']['post'](`${this['demoUrl']}/api/URLSetup/RegisterIPN`, this['regIpn'], {headers: headers}).subscribe({ //get IPN
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
            this['http']['post'](`${this['demoUrl']}/api/Transactions/SubmitOrderRequest`, order, {headers:headers}) //payment request
            .subscribe({
              next: (res:any) => {
                this.iframe = res.redirect_url //load payment iframe
              },
              error: (error:any) => console.error(error)
            })
          }, error: (err:any) => console.error(err)
        })
      },
      error: (err) => console.error(err),
      complete: () => { 
        this['snack']['open']("iframe loaded successfully",'x', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          politeness: 'assertive',
        }) 
      }
    })
  }
}

