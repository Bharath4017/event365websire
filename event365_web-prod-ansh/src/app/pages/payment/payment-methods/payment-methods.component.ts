import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from '../../../shared/utils/strings';
import { PaymentService } from '../payment.service';
import { StripeService, StripeCardNumberComponent, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
  PaymentIntent,
} from '@stripe/stripe-js';
import { YoureventalertComponent } from 'src/app/dialog/your-event-alert/youreventalert.component';
import { MatDialog } from '@angular/material/dialog';
import { EventService } from '../../event/event.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
import { SuccessDialogComponent } from 'src/app/dialog/success-dialog/success-dialog.component';
declare let $: any;
declare let ApplePaySession: any;
@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {
  STRINGS: any = localString;
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  // @ViewChild(StripeCardComponent) card: StripeCardComponent | any;
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  stripeTest!: FormGroup;
  reviewEventDetails: any;
  stripeCardValid = false;
  submitted = false;
  stripeCardNumberValid = false;
  stripeCardExpiryValid = false;
  stripeCardCvvValid = false;
  stripeCardNumberError: any;
  stripeCardExpiryError: any;
  stripeCardCvvError: any;
  cardList: any = [];
  isSaveCardDetails = true;
  eventAmount: any = 0;
  ticketAmount: any = 0;
  bookTicketDetail: any = 0;
  userQRKey: any;
  cutomerID: any;
  paymentId: any;
  paymentMethod: any;
  id: any;
  paypalOrderId: any;
  paymentStatus: any;
  paymentType: any;
  public payPalConfig!: IPayPalConfig;
  showCardType = localString.paymentTypes.stripe;

  eventId!: string;
  fees!: number;
  coupanCode!: string;
  constructor(
    private sharedService: SharedService, private paymentService: PaymentService,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private utilityService: UtilityService,
    private eventservice: EventService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.header.payment,
      isBack: true,
      headerSize: this.STRINGS.headerSize.small,
    });
  }

  ngOnInit(): void {
    this.utilityService.bookTicketAmount.subscribe(res => {
      this.bookTicketDetail = res.bookTicketDetail;
      this.ticketAmount = res.bookingAmount;
      this.eventId = res.eventId;
      this.fees = res.fees;
      this.coupanCode = res.coupanCode;
    })

    this.utilityService.createEventDetails.subscribe(res => {
      this.reviewEventDetails = res;
    });
    this.initConfig();
    this.utilityService.eventAmount.subscribe(res => {
      this.eventAmount = res.eventAmount;
      // if (this.eventAmount === 0) {
      //   this.postEvent();
      //   return;
      // }
    });

    if (!this.ticketAmount && !this.eventAmount) {
      this.router.navigate(['/home']);
    } else {
      this.stripeTest = this.fb.group({
        name: [null, [Validators.required]]
      });

      this.getCardDetails();
    }
  }

  getCardDetails(): void {
    this.utilityService.startLoader();
    this.paymentService
      .getStripeCardDetails()
      .then((response: any) => {
        if (response.success) {
          this.cardList = response.data;
          this.utilityService.stopLoader();
        }
      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }

  createPaymentMethod(): void {
    if (!this.stripeTest.valid && !this.stripeCardValid) {
      this.submitted = true;
      return;
    }

    this.utilityService.startLoader();

    this.stripeService
      .createPaymentMethod({
        type: 'card',
        card: this.card.element,
        billing_details: {
          name: this.stripeTest.value.name,
        },
      })
      .subscribe((result: any) => {
        if (result.error) {
          $('#alert-modal').modal('show');
          this.sharedService.modalContent.emit({
            content: result.error.message,
          });
        } else {
          this.instantPay(result.paymentMethod.id, '');
          // The payment has been processed!
          if (true) {
            // Show a success message to your customer
          }
        }
      });
  }

  postEvent() {
    let body: any;
    let startDate = moment(this.reviewEventDetails.start).format('YYYY-MM-DD')
    let startTime = moment(this.reviewEventDetails.startTime, 'HH:mm:ss').format('hh:mm a');
    let endDate = moment(this.reviewEventDetails.end).format('YYYY-MM-DD')
    let endTime = moment(this.reviewEventDetails.endTime, 'HH:mm:ss').format('hh:mm a');
    let contactHostData = JSON.parse(sessionStorage.getItem('contactHostData') || '')
    // console.log('contactHostData', contactHostData)
    body = {
      eventType: this.reviewEventDetails.eventType,
      categoryId: this.reviewEventDetails.categoryId,
      subCategoryId: JSON.stringify(this.reviewEventDetails.subCategoryId),
      name: this.reviewEventDetails.name,
      eventOccurrenceType: this.reviewEventDetails.eventOccurrenceTypeName,
      occurredOn: JSON.stringify(this.reviewEventDetails.occurredOn),
      start: startDate + ' ' + startTime,
      end: endDate + ' ' + endTime,
      venueId: this.reviewEventDetails.venueDetails.id,
      venueName: this.reviewEventDetails.venueDetails.venueName,
      venueAddress: this.reviewEventDetails.venueDetails.venueAddress,
      subVenueEvent: JSON.stringify(this.reviewEventDetails.subVenueEvent),
      // countryCode: '+91',
      city: 'Pune',
      venueLatitude: this.reviewEventDetails.venueDetails.latitude,
      venueLongitude: this.reviewEventDetails.venueDetails.longitude,
      paidType: 'paid',
      isEventPaid: '1',
      sellingStart: moment(this.reviewEventDetails.start).format('YYYY-MM-DD hh:mm a'),
      sellingEnd: moment(this.reviewEventDetails.end).format('YYYY-MM-DD hh:mm a'),
      description: this.reviewEventDetails.description,
      description2: this.reviewEventDetails.description2,
      hostMobile: contactHostData?.hostMobile ? contactHostData?.hostMobile : '',
      countryCode: contactHostData?.countryCode ? contactHostData?.countryCode : '',
      hostAddress: contactHostData?.hostAddress ? contactHostData?.hostAddress : '',
      websiteUrl: contactHostData?.websiteUrl ? contactHostData?.websiteUrl : '',
      otherWebsiteUrl: contactHostData?.otherWebsiteUrl ? contactHostData?.otherWebsiteUrl : ''

    };


    // if (this.freeEvent.length > 0) {
    //   body['free'] = JSON.stringify(this.freeEvent);
    // }
    // if (this.paidEvent.length > 0) {
    //   body['regularPaid'] = JSON.stringify(this.paidEvent);
    // }
    // if (this.rsvpEvent.length > 0) {
    //   body['regularSeatings'] = JSON.stringify(this.rsvpEvent);
    // }
    // if (this.tableSeating.length > 0) {
    //   body['tableSeatings'] = JSON.stringify(this.tableSeating);
    // }
    // if (this.vipEvent.length > 0) {
    //   body['vipSeatings'] = JSON.stringify(this.vipEvent);
    // }
    const formData: any = new FormData();
    // tslint:disable-next-line: forin
    for (const key in body) {
      formData.append(key, body[key]);
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.reviewEventDetails.selectedImages.length; i++) {
      formData.append('images', this.reviewEventDetails.selectedImages[i]);
    }
    // console.log(body);
    // console.log(formData);
    this.eventservice.reviewEventPostApi(formData).then((response: any) => {
      const dialogRef = this.dialog.open(YoureventalertComponent, {
        width: '420px',
        data: {
          response
        },
        panelClass: 'custom_dilog'
      });
      dialogRef.afterClosed().subscribe(() => {
        localStorage.removeItem('eventData');
        // localStorage.removeItem('reviewDetails');
        this.utilityService.createEventDetails.next('');
        this.utilityService.venueDetails.next('');
        this.utilityService.detailedEvent.next('');
        this.router.navigate(['/home']);
        this.utilityService.stopLoader();
      });
    })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });

    sessionStorage.removeItem('contactHostData');
  }

  bookTicket() {
    for (let i in this.bookTicketDetail) {
      let obj = this.bookTicketDetail[i];
      delete obj['amount'];
      delete obj['discount'];
    }
    this.utilityService.startLoader();
    this.eventservice.postBookUserTicket(this.id, this.bookTicketDetail).then((response: any) => {
      if (response.success) {
        this.userQRKey = response.data.QRkey;
        this.cutomerID = response.data.customerId;
        this.paymentRequest();
      }
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      this.utilityService.routingAccordingToError(error);
    });
  }

  paymentRequest(): void {
    let body = {};

    if (this.coupanCode) {
      if (this.paypalOrderId) {
        body = {
          QRkey: this.userQRKey,
          amount: Number((this.ticketAmount * 100).toFixed(0)),
          currency: 'usd',
          customer: this.cutomerID,
          paymentMethod: this.paymentMethod,
          paymentId: this.paypalOrderId,
          status: this.paymentStatus,
          paymentType: this.paymentType,
          eventId: this.eventId,
          fees: this.fees,
          coupanCode: this.coupanCode
        };
      } else {
        body = {
          QRkey: this.userQRKey,
          amount: Number((this.ticketAmount * 100).toFixed(0)),
          currency: 'usd',
          customer: this.cutomerID,
          paymentMethod: this.paymentMethod,
          paymentType: this.paymentType,
          eventId: this.eventId,
          fees: this.fees,
          coupanCode: this.coupanCode
        };
      }
    } else {
      if (this.paypalOrderId) {
        body = {
          QRkey: this.userQRKey,
          amount: Number((this.ticketAmount * 100).toFixed(0)),
          currency: 'usd',
          customer: this.cutomerID,
          paymentMethod: this.paymentMethod,
          paymentId: this.paypalOrderId,
          status: this.paymentStatus,
          paymentType: this.paymentType,
          eventId: this.eventId,
          fees: this.fees
        };
      } else {
        body = {
          QRkey: this.userQRKey,
          amount: Number((this.ticketAmount * 100).toFixed(0)),
          currency: 'usd',
          customer: this.cutomerID,
          paymentMethod: this.paymentMethod,
          paymentType: this.paymentType,
          eventId: this.eventId,
          fees: this.fees
        };
      }
    }

    this.paymentService.ticketPaymentRequest(body).then((response: any) => {
      if (response.success) {
        if (this.paypalOrderId) {
          $('#success-modal').modal('show');
          this.sharedService.modalContent.emit({ content: this.STRINGS.bookTicket.bookTicketSuccess });
        } else {
          this.paymentConfirm();
        }
      }
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      this.utilityService.routingAccordingToError(error);
    });
  }

  paymentConfirm() {
    const body = {
      "paymentId": this.paymentId,
      "payment_method": this.paymentMethod,
      "QRkey": this.userQRKey
    }
    this.paymentService.confirmPayment(body).then((response: any) => {
      if (response.success) {
        this.utilityService.stopLoader();
        $('#success-modal').modal('show');
        this.sharedService.modalContent.emit({ content: this.STRINGS.bookTicket.bookTicketSuccess });
      }
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      this.utilityService.routingAccordingToError(error);
    });
  }

  onChange(event: any): void {
    this.stripeCardValid = event.complete;
  }

  handleCardError(event: any, type: string): void {
    if (type === 'cardNumber') {
      this.stripeCardNumberValid = event.complete;
      this.stripeCardNumberError = event.error;
    } else if (type === 'cardExpiry') {
      this.stripeCardExpiryValid = event.complete;
      this.stripeCardExpiryError = event.error;
    } else if (type === 'cardCvv') {
      this.stripeCardCvvValid = event.complete;
      this.stripeCardCvvError = event.error;
    }
    this.stripeCardValid = (this.stripeCardNumberValid && this.stripeCardExpiryValid && this.stripeCardCvvValid) ? true : false;
  }

  instantPay(savedCardId: any, type: any): any {
    let cardValue = this.card.element;
    if (type === 'payBySavedCards') {
      cardValue = savedCardId;
    }
    this.utilityService.startLoader();
    let body = {};
    if (type === 'payBySavedCards') {
      if (this.eventAmount) {
        body = {
          amount: this.eventAmount,
          currency: 'usd',
          paymentMethod: savedCardId,
          isPaymentMethodSave: true
        };
      }
      else if (this.ticketAmount) {
        body = {
          amount: this.ticketAmount,
          currency: 'usd',
          paymentMethod: savedCardId,
          isPaymentMethodSave: true
        };
      }
    }
    else {
      if (this.eventAmount) {
        body = {
          amount: this.eventAmount,
          currency: 'usd',
          paymentMethod: savedCardId,
          isPaymentMethodSave: true
        };
      }
      else if (this.ticketAmount) {
        body = {
          amount: this.ticketAmount,
          currency: 'usd',
          paymentMethod: savedCardId,
          isPaymentMethodSave: true
        };
      }
    }

    this.paymentService.postClientSecret(body)
      .then((response: any) => {
        if (response.success) {
          this.confirmPayment(response.data, cardValue);
          //  this.postEvent();
          // this.utilityService.stopLoader();
          
        }
      })
      .catch((error: any) => {
        $('#alert-modal').modal('show');
        this.sharedService.modalContent.emit({
          content: error.error.message,
        });
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }

  confirmPayment(clientSecret: any, cardDetail: any): void {
    // this.utilityService.stopLoader();
    let payload: any = {};
    payload = {
      payment_method: {
        card: cardDetail,
        billing_details: {
          name: this.stripeTest.value.name,
        },
      },
    };

    if (this.isSaveCardDetails) {
      payload['setup_future_usage'] = 'off_session';
    }

    this.stripeService.confirmCardPayment(clientSecret, payload)
      .subscribe((result) => {
        console.log(result);
        if (result.error) {
          $('#alert-modal').modal('show');
          this.sharedService.modalContent.emit({
            content: result.error.message,
          });
          this.utilityService.stopLoader();
          // Show error to your customer (e.g., insufficient funds)
          // console.log(result.error.message);
        } else {
          // The payment has been processed!

          if (result.paymentIntent?.status === 'succeeded') {
            this.paymentId = result.paymentIntent?.id;
            this.paymentMethod = result.paymentIntent?.payment_method;
            if (this.eventAmount) {
              //console.log("post Event Api");
              // this.postEvent();
              this.paymentComplete(this.paymentId);
            }
            else if (this.ticketAmount) {
              this.paymentType = 'stripe';
              this.bookTicket();
            }
            //  this.utilityService.stopLoader();
            // Show a success message to your customer
          }
        }
      }, (err) => {
        this.utilityService.stopLoader();
      });
  }

  createToken(): void {
    const name = this.stripeTest.controls['name'].value;
    this.stripeService
      .createToken(this.card.element, { name })
      .subscribe((result) => {
        if (result.token) {
          // Use the token
          console.log(result.token.id);
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
        
      });
  }
  paymentComplete(paymentId: any): any {
    let eventidres
    this.utilityService.eventId.subscribe(res => {
      eventidres = res.eventId;
      // if (this.eventAmount === 0) {
      //   this.postEvent();
      //   return;
      // }
    });
    const body = {
      eventId: eventidres,
      paymentId,
      amount: this.eventAmount
    };
    this.utilityService.startLoader();
    this.paymentService.paymentDoneAfterEventCreate(body)
      .then((response: any) => {
        if (response.success) {
          this.utilityService.stopLoader();
          localStorage.removeItem('eventData');
          this.utilityService.createEventDetails.next('');
          this.utilityService.venueDetails.next('');
          this.utilityService.detailedEvent.next('');
          this.successDialogopen('SuccessFully Payment Done and Event is Created');
          this.router.navigate(['/home']);
        }
      })
      .catch((error: any) => {
        $('#alert-modal').modal('show');
        this.sharedService.modalContent.emit({
          content: error.error.message,
        });
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  ////////////////////////////pay pal///////////////////
  private initConfig(): void {
    // console.log(this.reviewEventDetails)
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'AaFTKm9JkeHzWEl6-CSmjF07ipIEodrdebb3qrvL-RaXmElNlRSXztVz5QMO4Ut9s3l8aGnibRYxCL11',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: this.ticketAmount,
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: this.ticketAmount
                }
              }
            },
          }
        ]
      },
      advanced: {
        commit: 'false'
      },
      style: {
        label: 'paypal',
        layout: 'horizontal',
        size: 'small',
        shape: 'pill',
      },
      onApprove: (data, actions) => {
        // this.dialogopen('transaction was approved, but not authorized');
        // console.log('onApprove - transaction was approved, but not authorized', data, actions);

        actions.order.get().then((details: any) => {
          // this.successDialogopen('onApprove - you can get full order details inside onApprove');
          // console.log('onApprove - you can get full order details inside onApprove: ', details);
          if (this.eventAmount) {
            //  console.log("post Event Api");
            // this.postEvent();
            this.paymentComplete(details.id);
          }
          else if (this.ticketAmount) {
            this.paypalOrderId = details.id;
            this.paymentStatus = details.status;
            this.paymentType = 'paypal';
            this.bookTicket();
          }
        });
      },
      onClientAuthorization: (data) => {
        // this.dialogopen('you should probably inform your server about completed transaction at this point');
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        //this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        this.dialogopen('Cancel Transaction')
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        this.dialogopen('Something Went Wrong Please Try again letter');
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        // console.log('onClick', data, actions);
      },
    };
  }
  dialogopen(name: any): void {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: '460px',
      data: {
        name,
      },
      panelClass: 'custom_dilog',
    });
  }

  successDialogopen(name: any): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: '460px',
      data: {
        message: name,
      },
      panelClass: 'custom_dilog',
    });
  }


  /////////////////////apple
  payApple() {
    var applePayUiController = (function () {
      var DOMStrings = {
        appleButton: 'ckoApplePay',
        errorMessage: 'ckoApplePayError'
      }
      return {
        DOMStrings,
        displayApplePayButton: function () {
          document.getElementById(DOMStrings.appleButton)!.style.display = 'block';
        },
        hideApplePayButton: function () {
          document.getElementById(DOMStrings.appleButton)!.style.display = 'none';
        },
        displayErrorMessage: function () {
          document.getElementById(DOMStrings.errorMessage)!.style.display = 'block';
        }
      }
    })();
    var applePayController = (function (uiController: any) {
      var BACKEND_URL_VALIDATE_SESSION = 'https://api.365live.com/api/validateSession';
      var BACKEND_URL_PAY = 'https://{your backend URL}/pay';

      // High level configuration options.
      var config = {
        payments: {
          acceptedCardSchemes: ['amex', 'masterCard', 'maestro', 'visa', 'mada']
        },
        shop: {
          product_price: 10.0,
          shop_name: 'Demo Shop',
          shop_localisation: {
            currencyCode: 'USD',
            countryCode: 'US'
          }
        }
      }
      /**
       * Checks if Apple Pay is possible in the current environment.
       * @return {boolean} Boolean to check if Apple Pay is possible
       */
      var _applePayAvailable = function () {
        return ApplePaySession && ApplePaySession.canMakePayments()
      }

      /**
       * Starts the Apple Pay session using a configuration
       */
      var _startApplePaySession = function (config: any) {
        var applePaySession = new ApplePaySession(6, config)
        _handleApplePayEvents(applePaySession)
        applePaySession.begin()
      }

      /**
       * This method cals your backend server with the Apple Pay validation URL.
       * On the backend, a POST request will be done to this URL with the Apple Pay certificates
       * and the outcome will be returned
       *
       * @param {string} appleUrl The Apple Pay validation URL generated by Apple
       * @param {function} callback Callback function used to return the server call outcome
       *
       * @return {object} The session payload
       *
       */
      var _validateApplePaySession = function (appleUrl: any, callbac: any) {
        // I'm using AXIOS to do a POST request to the backend but any HTTP client can be used
        const url = BACKEND_URL_VALIDATE_SESSION;
        appleUrl = appleUrl; //'https://apple-pay-gateway.apple.com/paymentservices/paymentSession';
        const options = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            url: appleUrl
          })
        };
        fetch(url, options)
          .then(response => {
            console.log(response.status);
            console.log(response.json())
            response.json().then(data => {
              callbac(data);
            })
          });
      }

      /**
       * This method returns the available payment methods for a certain region. You can add
       * your business logic here to determine the shipping methods you need.
       *
       * @param {string} 2 Letter ISO of the region
       *
       * @return {Array} An array of shipping methods
       *
       */
      var _getAvailableShippingMethods = function (region: any) {
        // return the shipping methods available based on region
        // if (region === 'US') {
        //   return { methods: config.shipping.US_region }
        // } else {
        //   return { methods: config.shipping.WORLDWIDE_region }
        // }
      }

      var _calculateTotal = function (subtotal: any, shipping: any) {
        return (parseFloat(subtotal) + parseFloat(shipping)).toFixed(2)
      }

      // here we talk to our backend to send the Apple Pay Payload and return the transaction outcome
      var _performTransaction = function (details: any, callback: any) {
        // I'm using AXIOS to do a POST request to the backend but any HTTP client can be used
        const url = BACKEND_URL_PAY;
        const options = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            token: details.token,
            customerEmail: details.shippingContact.emailAddress,
            billingDetails: details.billingContact,
            shippingDetails: details.shippingContact
          })
        };
        fetch(url, options)
          .then(response => {
            console.log(response.status);
          });
      }

      /**
       * This is the main method of the script, since here we handle all the Apple Pay
       * events. Here you are able to populate your shipping methods, react to  shipping methods
       * changes, and many other interaction that the user has with the Apple Pay pup-up.
       *
       * @param {object} Apple Pay Session (the one generate on the button click)
       *
       */
      var _handleApplePayEvents = function (appleSession: any) {
        // This is the first event that Apple triggers. Here you need to validate the
        // Apple Pay Session from your Back-End
        appleSession.onvalidatemerchant = function (event: any) {
          _validateApplePaySession(event.validationURL, function (merchantSession: any) {
            appleSession.completeMerchantValidation(merchantSession)
          })
        }

        // This method is triggered before populating the shipping methods. This is the
        // perfect place inject your shipping methods
        appleSession.onshippingcontactselected = function (event: any) {
          // populate with the availbale shipping methods for the region (Apple will tell you the region).
          // while the full address will only be available to you after the user confirms tha payment
          // var shipping = _getAvailableShippingMethods(
          //   config.shop.shop_localisation.countryCode
          // )
          // // Update total and line items based on the shipping methods
          // var newTotal = {
          //   type: 'final',
          //   label: config.shop.shop_name,
          //   amount: _calculateTotal(
          //     config.shop.product_price,
          //     shipping.methods[0].amount
          //   )
          // }
          // var newLineItems = [
          //   {
          //     type: 'final',
          //     label: 'Subtotal',
          //     amount: config.shop.product_price
          //   },
          //   {
          //     type: 'final',
          //     label: shipping.methods[0].label,
          //     amount: shipping.methods[0].amount
          //   }
          // ]
          // appleSession.completeShippingContactSelection(
          //   ApplePaySession.STATUS_SUCCESS,
          //   shipping.methods,
          //   newTotal,
          //   newLineItems
          // )
        }

        // This method is triggered when a user select one of the shipping options.
        // Here you generally want to keep track of the transaction amount
        appleSession.onshippingmethodselected = function (event: any) {
          var newTotal = {
            type: 'final',
            label: config.shop.shop_name,
            amount: _calculateTotal(
              config.shop.product_price,
              event.shippingMethod.amount
            )
          }
          var newLineItems = [
            {
              type: 'final',
              label: 'Subtotal',
              amount: config.shop.product_price
            },
            {
              type: 'final',
              label: event.shippingMethod.label,
              amount: event.shippingMethod.amount
            }
          ]
          appleSession.completeShippingMethodSelection(
            ApplePaySession.STATUS_SUCCESS,
            newTotal,
            newLineItems
          )
        }

        // This method is the most important method. It gets triggered after the user has
        // confirmed the transaction with the Touch ID or Face ID. Besides getting all the
        // details about the customer (email, address ...) you also get the Apple Pay payload
        // needed to perform a payment.
        appleSession.onpaymentauthorized = function (event: any) {
          _performTransaction(event.payment, function (outcome: any) {
            if (outcome.approved) {
              appleSession.completePayment(ApplePaySession.STATUS_SUCCESS)
              console.log(outcome)
            } else {
              appleSession.completePayment(ApplePaySession.STATUS_FAILURE)
              console.log(outcome)
            }
          })
        }
      }

      /**
       * Sets a onClick listen on the Apple Pay button. When clicked it will
       * begin the Apple Pay session with your configuration
       */
      var _setButtonClickListener = function () {
        let doc = document
          .getElementById(uiController.DOMStrings.appleButton)!
          .addEventListener('click', function () {
            _startApplePaySession({
              currencyCode: config.shop.shop_localisation.currencyCode,
              countryCode: config.shop.shop_localisation.countryCode,
              merchantCapabilities: ['supportsDebit', 'supportsCredit', 'supports3DS'],
              supportedNetworks: config.payments.acceptedCardSchemes,
              total: {
                label: config.shop.shop_name,
                amount: config.shop.product_price,
                type: 'final'
              }
            })
          })
      };

      return {
        init: function () {
          // If Apple Pay is available show the button otherwise show the error
          if (_applePayAvailable()) {
            // Notice we are using the functions from our UI controller
            uiController.displayApplePayButton()
          } else {
            uiController.hideApplePayButton();
            uiController.displayErrorMessage();
          }

          // Set the onClick listener on the Apple Pay button
          _setButtonClickListener();
        }
      }
    })(applePayUiController) // passing the UI controller

    // Initialise the Apple Pay controller and let the magic happen
    applePayController.init()
  }
}
