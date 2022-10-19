import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
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
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrls: ['./app.component.scss'],
  template: `
    <body data-menu-position="closed" id="bd">
    <div class="jPanelMenu-panel" style="position: relative; left: 0px;">
        <div>
            <div style="position: relative; left: 0px;" class="jPanelMenu-panel">
                <div>
                    <div id="pp-wrapper">
                        <a id="top"></a>
                        <header>
                            <div class="header shadow3">
                                <div class="container">
                                    <div class="row-fluid">
                                        <h2 id="pp-logo" class="span3">
                                            <a href="https://www.pesapal.com/"><span>Pesapal - Kenya</span></a>
                                        </h2>
                                        <div class="span4 offset1">
                                            <ul id="pp-mainnav">
                                                <li id="tm_020"><a href="https://www.pesapal.com/dashboard/account/register/?ppsid=eyZxdW90O1JlcXVlc3RJZCZxdW90OzomcXVvdDtlYjdmNjkxYiZxdW90OywmcXVvdDtTZXNzaW9uQ291bnRyeSZxdW90OzomcXVvdDtrZSZxdW90OywmcXVvdDtJc0RldmljZSZxdW90OzpmYWxzZX0%3D">Personal</a></li>
                                                <li id="tm_050"><a href="https://www.pesapal.com/dashboard/account/register/?ppsid=eyZxdW90O1JlcXVlc3RJZCZxdW90OzomcXVvdDtlYjdmNjkxYiZxdW90OywmcXVvdDtTZXNzaW9uQ291bnRyeSZxdW90OzomcXVvdDtrZSZxdW90OywmcXVvdDtJc0RldmljZSZxdW90OzpmYWxzZX0%3D">Business</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <section id="main">
                            <div id="pp-main">
                                <div id="pp-content" class="">
                                    <div class="container ">
                                        <br>
                                        <div class="row-fluid">
                                            <div class="span7">

                                                <ol type="1">
                                                    <li>Read our online documentation. Follow it step by step. <a target="_blank" href="https://developer.pesapal.com/">Read Now</a> </li>
                                                    <li>Use ISO currency codes. Get them <a target="_blank" href="http://en.wikipedia.org/wiki/ISO_4217">here</a> </li>
                                                    <li>
                                                        Find the difference below between an IPN URL and an IPN_Id :-)
                                                        <ul type="circle">
                                                            <li>IPN URL - The notification url Pesapal with send a status alert to. </li>
                                                            <li>IPN_Id(Notification_id) - Uniquely identifies the endpoint Pesapal will send alerts to whenever a payment status changes for each transaction processed via API 3.0. In other word the IPN Id represents
                                                                the IPN URL,</li>
                                                            <b>Please Note</b> An IPN_id is a mandatory field when submitting an order request to Pesapal API 3.0
                                                        </ul>

                                                    </li>
                                                    <li>It's advicable to use unique reference numbers for all transaction.</li>
                                                    <li>Is there an API that returns the amount paid? Currently this is unavailable. You are advised to store the payment details before submitting the data to PesaPal.</li>
                                                    <li>Where can i get the secret code mentioned in the documentation? <br> - Open business account at: <a href="https://www.pesapal.com/">https://www.pesapal.com</a> (for Live system)<br> or <a href="https://developer.pesapal.com/api3-demo-keys.txt">https://developer.pesapal.com/api3-demo-keys.txt</a>(For
                                                        demo credentials).<br><br>The sandbox is a demo/test credentials are sample keys that you can use to test your system during development. With the sandbox, you need not to transfer real money. Dummy
                                                        codes will be generated for you.</li>
                                                    <li>How do i test using the dummy codes? <br>For card options use the values below the input fields and for mobile payments, there is some text below the payment options, click link within the text to generate
                                                        dummy codes.</li>
                                                    <li>Am done testing, i need to go live. How do i do that? <a href="https://developer.pesapal.com/how-to-integrate/api-30-json/api-reference">Solution</a></li>
                                                    <li>I noticed there is a "DESCRIPTION" on the form, whats that for? <br>Description is a short text giving details about the payment, Eg, Donations to XYZ Organization/ payment for Tv set bought from ABC
                                                        ltd </li>
                                                    <li>My submit button on the payments page is hidden, what could be the issue? This is a styling issue. Open the iframe code and increase the size of the iframe loaded.</li>
                                                    <span title="click me" style="cursor: pointer;" *ngIf="iframe" (click)="openBottomSheet()"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="26" height="26" viewBox="0 0 26 26" style=" fill:#000000;"><path d="M 13 1.1875 C 6.476563 1.1875 1.1875 6.476563 1.1875 13 C 1.1875 19.523438 6.476563 24.8125 13 24.8125 C 19.523438 24.8125 24.8125 19.523438 24.8125 13 C 24.8125 6.476563 19.523438 1.1875 13 1.1875 Z M 15.460938 19.496094 C 14.851563 19.734375 14.367188 19.917969 14.003906 20.042969 C 13.640625 20.167969 13.222656 20.230469 12.742188 20.230469 C 12.007813 20.230469 11.433594 20.050781 11.023438 19.691406 C 10.617188 19.335938 10.414063 18.878906 10.414063 18.324219 C 10.414063 18.109375 10.429688 17.890625 10.460938 17.667969 C 10.488281 17.441406 10.539063 17.191406 10.605469 16.90625 L 11.367188 14.21875 C 11.433594 13.960938 11.492188 13.71875 11.539063 13.488281 C 11.585938 13.257813 11.605469 13.046875 11.605469 12.855469 C 11.605469 12.515625 11.535156 12.273438 11.394531 12.140625 C 11.25 12.003906 10.980469 11.9375 10.582031 11.9375 C 10.386719 11.9375 10.183594 11.96875 9.976563 12.027344 C 9.769531 12.089844 9.59375 12.148438 9.445313 12.203125 L 9.648438 11.375 C 10.144531 11.171875 10.621094 11 11.078125 10.855469 C 11.53125 10.710938 11.964844 10.636719 12.367188 10.636719 C 13.097656 10.636719 13.664063 10.816406 14.058594 11.167969 C 14.453125 11.519531 14.652344 11.980469 14.652344 12.542969 C 14.652344 12.660156 14.640625 12.867188 14.613281 13.160156 C 14.585938 13.453125 14.535156 13.722656 14.460938 13.972656 L 13.703125 16.652344 C 13.640625 16.867188 13.585938 17.113281 13.535156 17.386719 C 13.488281 17.660156 13.464844 17.871094 13.464844 18.011719 C 13.464844 18.367188 13.542969 18.613281 13.703125 18.742188 C 13.859375 18.871094 14.136719 18.933594 14.53125 18.933594 C 14.714844 18.933594 14.921875 18.902344 15.15625 18.839844 C 15.386719 18.773438 15.554688 18.71875 15.660156 18.667969 Z M 15.324219 8.617188 C 14.972656 8.945313 14.546875 9.109375 14.050781 9.109375 C 13.554688 9.109375 13.125 8.945313 12.769531 8.617188 C 12.414063 8.289063 12.238281 7.890625 12.238281 7.425781 C 12.238281 6.960938 12.417969 6.558594 12.769531 6.226563 C 13.125 5.894531 13.554688 5.730469 14.050781 5.730469 C 14.546875 5.730469 14.972656 5.894531 15.324219 6.226563 C 15.679688 6.558594 15.855469 6.960938 15.855469 7.425781 C 15.855469 7.890625 15.679688 8.289063 15.324219 8.617188 Z"></path></svg></span>
                                                </ol>
                                            </div>
                                            <div class="span5">
                                                <form id="rightcol" [formGroup]="form" (ngSubmit)="getToken()" class="rounded5">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td>Environment:</td>
                                                                <td>
                                                                    <mat-radio-group>
                                                                        <mat-radio-button (change)="onEnvChanged($event)" class="example-margin" [value]="'https://cybqa.pesapal.com/pesapalv3'">
                                                                            Sandbox
                                                                        </mat-radio-button>
                                                                        <mat-radio-button (change)="onEnvChanged($event)" class="example-margin" [value]="'https://pay.pesapal.com/v3'">
                                                                            Live
                                                                        </mat-radio-button>
                                                                    </mat-radio-group>
                                                                    <h5 [style.color]="'red'" *ngIf="!demoUrl">
                                                                        Select the environment before proceeding
                                                                    </h5>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Amount</td>
                                                                <input [ngStyle]="{'pointer-events' : !demoUrl ? 'none' : 'all'}" [formControl]="form.controls.amount" type="number" name="text">
                                                                <td></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Currency:</td>
                                                                <td>
                                                                    <mat-form-field [ngStyle]="{'pointer-events' : !demoUrl ? 'none' : 'all'}">
                                                                        <mat-label>Currency</mat-label>
                                                                        <mat-select [formControl]="form.controls.currency">
                                                                            <mat-option *ngFor="let cash of options" value="{{cash.value}}">{{cash.name}}</mat-option>
                                                                        </mat-select>
                                                                    </mat-form-field>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Description:</td>
                                                                <td>
                                                                    <textarea [ngStyle]="{'pointer-events' : !demoUrl ? 'none' : 'all'}" [formControl]="form.controls.description" placeholder="Description" id="password" name="password" class="input-password">
                                                                        </textarea>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                            </tr>
                                                            <tr>
                                                                <td colspan="2">
                                                                    <hr>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>First Name</td>
                                                                <input [disabled]="true" type="text" name="description" [value]="'John'">
                                                                <td></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Last Name</td>
                                                                <input [disabled]="true" type="text" name="description" [value]="'Doe'">
                                                                <td></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Email Address</td>
                                                                <input [disabled]="true" type="text" name="description" [value]="'john.doe@example.com'">
                                                                <td></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Phone Number</td>
                                                                <input [disabled]="true" type="text" name="description" [value]="'0712345678'">
                                                                <td></td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan="2">
                                                                    <hr>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan="2">
                                                                    <input type="submit" [value]="'Make Payment'" class="btn" [disabled]="!form.valid 
                                                                || form.getRawValue().amount <= 0 
                                                                || !demoUrl">
                                                                    <p [style.color]="'red'" *ngIf="form.getRawValue()?.amount <= 0 && form.get('amount')?.touched">
                                                                        Amount should be greater than 0
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </form>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </section>
                        <section>
                            <div>
                                <iframe *ngIf="iframe" [src]="iframe | safeUrl"></iframe>
                            </div>
                        </section>

                        <footer>
                            <div class="pp-footmenu container">
                                <div class="row-fluid">
                                    <div class="span9">
                                        <ul class="nav nav-pills">
                                            <li><a href="https://www.pesapal.com/home/aboutus">About PesaPal</a></li>
                                            <li><a href="https://www.pesapal.com/home/features">Features</a></li>
                                            <li><a href="https://www.pesapal.com/home/products">Discover PesaPal</a></li>
                                            <li><a href="http://support.pesapal.com/" target="_blank">Support</a></li>
                                            <li><a href="https://www.pesapal.com/home/contactus">Contact PesaPal</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="footer">
                                <div class="pp-footsummary container">

                                    <div class="smmenu row-fluid">
                                        <div class="span2 bdr">
                                            <h5><a href="https://www.pesapal.com/home/index.html">Consumers</a></h5>
                                            <ul>
                                                <li><a href="https://www.pesapal.com/billpayments">Pay your bill</a></li>
                                                <li><a href="https://www.pesapal.com/schoolpay">Pay School Fees </a></li>
                                                <li><a href="https://www.pesapal.com/buy/airtime">Buy Airtime</a></li>
                                                <li><a href="https://www.pesapal.com/buy/tickets">Buy Event Tickets </a></li>
                                                <li><a href="https://www.pesapal.com/buy/directory">Find places to shop </a></li>
                                            </ul>
                                        </div>
                                        <div class="span2 bdr">
                                            <h5><a href="https://www.pesapal.com/home/business.html">Businesses</a></h5>
                                            <ul>
                                                <li><a href="https://www.pesapal.com/products/ecommerce">Accept Online Payments</a></li>
                                                <li><a href="https://www.pesapal.com/products/invoices">Online invoicing</a></li>
                                                <li><a href="https://www.pesapal.com/products/schoolpay">Simpleselling</a></li>
                                                <li><a href="https://www.pesapal.com/products/eventtickets">Sell event tickets</a></li>
                                                <li><a href="https://www.pesapal.com/account/merchantregister">Register yor business</a></li>
                                            </ul>
                                        </div>
                                        <div class="span2 bdr">
                                            <h5><a href="http://developer.pesapal.com/" target="_blank">Developers</a></h5>
                                            <ul>
                                                <li><a href="http://developer.pesapal.com/" target="_blank">Developers Area</a></li>
                                                <li><a href="http://developer.pesapal.com/how-to-integrate/step-by-step" target="_blank">Intergrate PesaPal</a></li>
                                                <li><a href="http://developer.pesapal.com/forum/4-plugins" target="_blank">Download Plugins</a></li>
                                                <li><a href="http://developer.pesapal.com/forum" target="_blank">Ask a question</a></li>
                                                <li><a href="http://developer.pesapal.com/integration-partners" target="_blank">Intergration Partners</a></li>
                                            </ul>
                                        </div>
                                        <div class="span4 bdr">
                                            <h5><a href="http://127.0.0.1/sample_api3/">Talk to us</a></h5>
                                            <div class="row-fluid">
                                                <p class="span6">
                                                    PesaPal Limited <br> Dagoretti Lane <br> Off Naivasha Road<br> P.O Box 1179-00606<br> Nairobi, Kenya
                                                </p>
                                                <p class="span6">
                                                    <strong>Tel</strong> +254-(0)70-619-1729, +254-(0)202-495-438
                                                    <br>
                                                    <strong>Email</strong>: <a href="mailto:info@pesapal.com">info@pesapal.com</a> </p>
                                            </div>
                                        </div>
                                        <div class="span2">
                                            <h5><a href="https://www.pesapal.com/security">Security</a></h5>
                                            <ul>
                                                <li><a href="https://www.pesapal.com/home/termsandconditions">Terms and Conditions</a></li>
                                                <li><a href="https://www.pesapal.com/home/privacypolicy">Privacy Policy</a></li>
                                                <li><a href="https://www.pesapal.com/security">PesaPal Security</a></li>
                                            </ul>

                                        </div>
                                    </div>
                                    <p class="pp-copyright">
                                        ©{{year}} PesaPal™. All rights reserved
                                    </p>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
  `
})

export class AppComponent implements OnInit {
  year:number = new Date().getFullYear()
  demoUrl:string = ""
  paymentData!: IForm
  form!:IFormGroup
  main_form!:IForm
  iframe:string = ""
  keys:any = {  // consumer keys and secret 
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
    private sheet: MatBottomSheet,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this['form'] = this.formBuilder.group({
      currency: ['', [Validators.required]],
      amount: ['', [Validators.required] ],
      description: ['', [ Validators.required, Validators.maxLength(256)] ]
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
            // console.log(res, "Billie Eilish")
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

  openBottomSheet(){
    this['sheet']['open'](BottomSheet)
  }
}

@Component({
  selector: 'app-sheet',
  template: `
  <b>Payment Iframe</b>
  <ol type="1">
    <li>At this point, its best you store the payment details inyour DB. Set the transaction status as PLACED</li>
    <li>The iframe with the payment options is a page from our PesaPal server. Its secured and is available over a secure https link</li>
    <li>It's not Mandatory to purchase the SSL certificate for your site</li>
  </ol>
  `
})
export class BottomSheet {}
