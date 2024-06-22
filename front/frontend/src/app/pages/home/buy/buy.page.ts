import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';
@Component({
  selector: 'app-buy',
  templateUrl: './buy.page.html',
  styleUrls: ['./buy.page.scss'],
})
export class BuyPage implements OnInit{
  stock:any
  transferType: any;
  selectedAccount: any;
  quantity: any;
  stockSymbol: any;
  stockData: any;
  validity:any;
  balance : any;
  cost: number = 0;
  constructor(private navCtrl: NavController,private route: ActivatedRoute , private productService: ProductService) {
    
    this.route.paramMap.subscribe(params => {
      if (params.has('symbol')) {
        const symbol = params.get('symbol');
        this.stock = history.state.stockData;
      }
    });
  }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.stockSymbol = params.get('symbol');
      this.stockData = this.productService.getStockBySymbol(this.stockSymbol);
      this.quantity = 1;
      this.validity = 1;
      this.stock = 0;
      this.balance = 1000;
    });
  }
  closePage() {
    this.navCtrl.pop();
  }

  changeAccount() {
    console.log('Change Account');
  }

  buy(stock: any, quantity: number) {
    const updatedQuantity = stock.quantity - quantity; // Assuming you're deducting the bought quantity
    this.stock = this.stock + quantity;
    this.balance = this.balance - this.stockData.price*quantity;
    if (updatedQuantity >= 0 && this.balance>0) {
      const success = this.productService.updateStockQuantity(stock.symbol, updatedQuantity);
      if (success) {
        // Successfully updated quantity
        console.log(`Quantity updated for ${stock.symbol}. New quantity: ${updatedQuantity}`);
        console.log(stock);
        
        // Optionally, navigate to another page or perform other actions
      } else {
        console.error(`Failed to update quantity for ${stock.symbol}`);
        // Handle failure scenario
      }
    } else {
      console.error(`Not enough quantity available for ${stock.symbol}`);
      // Handle insufficient quantity scenario
    }
  }
  incrementQuantity() {
    // Increment quantity
    this.quantity++;
    this.updateCost();
  }

  decrementQuantity() {
    // Decrement quantity, ensure it doesn't go below 1
    if (this.quantity > 1) {
      this.quantity--;
      this.updateCost();
    }
  }
  incrementValidity() {
    // Increment Validity
    this.validity++;
  }

  decrementValidity() {
    // Decrement Validity, ensure it doesn't go below 1
    if (this.validity > 1) {
      this.validity--;
    }
  }
  updateCost() {
    if (this.stockData && this.stockData.price) {
      this.cost = this.quantity * this.stockData.price;
    }
  }
}
