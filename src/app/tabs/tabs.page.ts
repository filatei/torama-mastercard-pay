import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  cartItemCount: number = 0;

  constructor(private cartService: CartService) {
     this.cartService.getCartItems().subscribe(val => {
      this.cartItemCount = val.length;
     })
  }

}
