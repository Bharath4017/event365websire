import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from '../../../shared/utils/strings';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// import { StripeService } from 'ngx-stripe';
// import {
//   StripeElementsOptions,
//   PaymentRequestPaymentMethodEvent,
//   PaymentIntent,
//   PaymentRequestShippingAddressEvent,
// } from '@stripe/stripe-js';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
@Component({
  selector: 'app-add-new-cards',
  templateUrl: './add-new-cards.component.html',
  styleUrls: ['./add-new-cards.component.scss']
})
export class AddNewCardsComponent implements OnInit {
  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  paymentRequestOptions = {
    country: 'IN',
    currency: 'usd',
    total: {
      label: 'Demo Total',
      amount: 1099,
    },
    requestPayerName: true,
    requestPayerEmail: true,
  };
  @ViewChild(StripeCardComponent) card: StripeCardComponent | any;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  stripeTest!: FormGroup;

  STRINGS: any = localString;
  paymentForm!: FormGroup;
  constructor(
    private sharedService: SharedService,
    private formbuilder: FormBuilder,
    // private http: HttpClient,
    private stripeService: StripeService
  ) {
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.header.payment,
      isBack: true,
      headerSize: this.STRINGS.headerSize.small,
    });
  }

  ngOnInit(): void {
    this.paymentForm = this.formbuilder.group({
      cardnumber: [''],
      expDate: [''],
      cvv: ['']
    });

    this.stripeTest = this.formbuilder.group({
      name: ['']
    });
  }

  onsubmit(){
   // console.log(this.paymentForm.value.cardnumber);
    (window as any).Stripe.card.createToken({
      number: '4242424242424242',
      exp_month: '12',
      exp_year: '20',
      cvc: '123'
    }, ( status: number , response: any ) =>
   console.log(response));

  }
  // onPaymentMethod(ev: PaymentRequestPaymentMethodEvent) {
  //   console.log('ev', ev);
  //   this.createPaymentIntent()
  //     .pipe(
  //       switchMap((pi: any) => {
  //         return this.stripeService
  //           .confirmCardPayment(
  //             pi.client_secret,
  //             { payment_method: ev.paymentMethod.id },
  //             { handleActions: false }
  //           )
  //           .pipe(
  //             switchMap((confirmResult) => {
  //               if (confirmResult.error) {
  //                 // Report to the browser that the payment failed, 
  //                 // prompting it to re-show the payment interface, 
  //                 // or show an error message and close the payment.
  //                 ev.complete('fail');
  //                 return of({
  //                   error: new Error('Error Confirming the payment'),
  //                 });
  //               } else {
  //                 // Report to the browser that the confirmation was 
  //                 // successful, prompting it to close the browser 
  //                 // payment method collection interface.
  //                 ev.complete('success');
  //                 // Let Stripe.js handle the rest of the payment flow.
  //                 return this.stripeService.confirmCardPayment(
  //                   pi.client_secret
  //                 );
  //               }
  //             })
  //           );
  //       })
  //     )
  //     .subscribe((result) => {
  //       if (result.error) {
  //         // The payment failed -- ask your customer for a new payment method.
  //       } else {
  //         // The payment has succeeded.
  //       }
  //     });
  // }

  // onShippingAddressChange(ev: PaymentRequestShippingAddressEvent) {
  //   if (ev.shippingAddress.country !== 'US') {
  //     ev.updateWith({ status: 'invalid_shipping_address' });
  //   } else {
  //     // Replace this with your own custom implementation if needed
  //     fetch('/calculateShipping', {
  //       data: JSON.stringify({
  //         shippingAddress: ev.shippingAddress,
  //       }),
  //     } as any)
  //       .then((response) => response.json())
  //       .then((result) =>
  //         ev.updateWith({
  //           status: 'success',
  //           shippingOptions: result.supportedShippingOptions,
  //         })
  //       );
  //   }
  // }

  // onNotAvailable() {
  //   // Subscribe to this event in case you want to act
  //   // base on availability
  //   console.log('Payment Request is not Available');
  // }

  // createPaymentIntent(): Observable<PaymentIntent> {
  //   // Replace this with your own custom implementation 
  //   // to perform a Payment Intent Creation
  //   // You will need your own Server to do that
  //   return this.http.post<PaymentIntent>(
  //     '/create-payment-intent',
  //     { amount: this.paymentRequestOptions.total.amount }
  //   );
  // }


  createToken(): void {
    const name = this.stripeTest.value.name;
    this.stripeService
      .createToken(this.card.element, { name })
      .subscribe((result) => {
        if (result.token) {
          // Use the token
         console.log(result);
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }

}
