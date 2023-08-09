import { Component, OnInit } from '@angular/core';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { ToramapayService } from 'src/app/services/toramapay.service';

declare var MastercardCheckoutServices: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  cartItems$: Observable<any[]>; // Cart items
  // totalPrice$: Observable<number>;
  private mcCheckoutService: any;

    
  // totalPrice$ = this.cartService.totalPrice$;


  constructor(private cartService: CartService,
    private torapaPayService: ToramapayService) {

    this.cartItems$ = this.cartService.getCartItems().pipe(
      shareReplay(1) // 1 means it will cache the latest emitted value
    );
  }

  private async initializeMastercardCheckoutServices() {
    const dpaId = '739ef2ec-f408-4df0-b513-0b467a99d79a';
    const dpaData = { 
      "dpaName": "Torama Global Services"
  };
    const dpaTransactionOptions = {
      "consumerEmailAddressRequested": true,
      "consumerPhoneNumberRequested": true,
      "dpaBillingPreference": "FULL",
      "dpaLocale": "en_US",
      "paymentOptions": [
      {
        "dynamicDataType": "CARD_APPLICATION_CRYPTOGRAM_SHORT_FORM"
      }
      ],
      "transactionAmount": {
      "transactionAmount": 100,
      "transactionCurrencyCode": "USD"
      }
    }
    const cardBrands = [ 
    "mastercard",
    "maestro",
    "visa",
    "amex",
    "discover"
];
    
    try {
      const result = await this.mcCheckoutService.init({ dpaId, dpaData, dpaTransactionOptions, cardBrands });
      // handle result
      console.log(result, 'result');
    } catch (error) {
      // handle error
      console.log(error, 'error');
    }
  }

  async ngOnInit() {
    this.mcCheckoutService = new MastercardCheckoutServices();
    this.initializeMastercardCheckoutServices();

    // (window as any).mcCheckoutService.init();
    // const mcCheckoutService = new MastercardCheckoutServices()
    // console.log(mc, 'mc');

    this.torapaPayService.initiateCheckout().subscribe(sessionId => {

      console.log(sessionId, 'sessionId');
      (window as any).mcCheckoutService.init()
      (window as any).Checkout.configure({
        session: {
          id: sessionId
        }
      });
    });

   
  }

  // Update the quantity of a specific item
  updateQuantity(item: any, quantity: number) {
    this.cartService.updateQuantity(item, quantity);
  }

  // Get the total price
  getTotalPrice() {
    return this.cartService.getTotalPrice();
  }

  errorCallback(error: any) {
    console.log(JSON.stringify(error));
  }

  cancelCallback() {
    console.log('Payment cancelled');
  }

  showEmbeddedPage() {
    (window as any).Checkout.showEmbeddedPage('#embed-target');
  }
  
  showPaymentPage() {
    (window as any).Checkout.showPaymentPage();
  }

}
