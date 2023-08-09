import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'shop.page.html',
  styleUrls: ['shop.page.scss']
})
export class ShopPage {
  products = [
    { id:1, name: 'Heineken', price: 50, icon: '/assets/images/product1.jpg' },
    { id:2, name: 'Gulder Lager', price: 60, icon: '/assets/images/product2.jpg' },
    { id:3, name: 'Guinness Stout', price: 50, icon: '/assets/images/product3.jpg' },
    { id:4, name: 'Star Lager', price: 60, icon: '/assets/images/product4.jpg' },
    { id:5, name: '333', price: 50, icon: '/assets/images/product3.jpg' },
    { id:6, name: 'Hero', price: 60, icon: '/assets/images/product4.jpg' },
    // Add other products with icons as needed
  ];

  constructor(private cartService:CartService) {}

  addToCart(product: any) {
    console.log('Added to cart:', product);
    this.cartService.addToCart(product);
    // Implement your add-to-cart logic here
  }

}
