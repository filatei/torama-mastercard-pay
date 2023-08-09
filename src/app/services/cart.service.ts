import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems: any[] = [];
  private cartItemsSubject = new BehaviorSubject<any[]>(this.cartItems);
  public cartItems$ = this.cartItemsSubject.asObservable();
  // public totalPrice$ = this.cartItems$.pipe(
  //   map(cartItems => cartItems.reduce((total, item) => total + item.price * item.quantity, 0))
  // );
  
  

  constructor() { }

  // Get cart items
  getCartItems() {
    return this.cartItems$;
  }

  // Add item to cart or update quantity if exists
  addToCart(item: any, quantity: number = 1) {
    const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ ...item, quantity });
    }
    this.cartItemsSubject.next(this.cartItems); // Update observable
  }

  // Update specific item's quantity
  updateQuantity(item: any, quantity: number) {
    const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity = quantity;
    }
    this.cartItemsSubject.next(this.cartItems); // Update observable
  }

  // Calculate total price
  getTotalPrice() {
    return this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

}
