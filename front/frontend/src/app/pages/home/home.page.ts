import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage{
  name: string | undefined;
  // stocks: any[] = [];
  stockSymbols: string[] = ['AAPL', 'GOOGL', 'MSFT'];
  stocks = [
    { symbol: 'AAPL', price: 150, change: +1.5, color: 'green' },
    { symbol: 'GOOGL', price: 2700, change: -0.5, color: 'red' },
    { symbol: 'AMZN', price: 3300, change: +2.1, color: 'green' },
    { symbol: 'MSFT', price: 290, change: -1.2, color: 'red' },
    { symbol: 'TSLA', price: 620, change: +3.0, color: 'green' },
    { symbol: 'FB', price: 340, change: -0.7, color: 'red' },
    { symbol: 'AAPL', price: 150, change: +1.5, color: 'green' },
    { symbol: 'GOOGL', price: 2700, change: -0.5, color: 'red' },
    { symbol: 'AMZN', price: 3300, change: +2.1, color: 'green' },
    { symbol: 'MSFT', price: 290, change: -1.2, color: 'red' },
    { symbol: 'TSLA', price: 620, change: +3.0, color: 'green' },
    { symbol: 'FB', price: 340, change: -0.7, color: 'red' }
  ];
  newStocks = [...this.stocks, ...this.stocks]; // Duplicate stocks for infinite scroll
  intervalId: any;
  constructor(private productService: ProductService,private authService : AuthenticationService) { }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.updateStockPrices();
    }, 1000);
    // this.loadStockData();
    // setInterval(() => {
    //   this.loadStockData();
    // }, 300000); // Refresh every 5 minutes
    // this.loadUserProfile()
  }
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  async loadUserProfile() {
    (await this.authService.getUserProfile()).subscribe(
      (data) => {
        this.name = data.name;
        
      },
      (error) => {
        console.error('Error fetching user profile:', error);
        // Handle error as needed
      }
    );
  }
  loadStockData() {
    this.stocks = [];
    this.stockSymbols.forEach(symbol => {
      this.productService.getStockData(symbol).subscribe(data => {
        const timeSeries = data['Time Series (5min)'];
        const latestTime = Object.keys(timeSeries)[0];
        const latestData = timeSeries[latestTime];
        const stock = {
          symbol: symbol,
          price: latestData['1. open'],
          change: ((latestData['4. close'] - latestData['1. open']) / latestData['1. open']) * 100,
          color: latestData['4. close'] >= latestData['1. open'] ? 'green' : 'red'
        };
        this.stocks.push(stock);
      });
    });
  }
  buyProduct(stocks:any){
  }
  sellProduct(stock:any){}

  updateStockPrices() {
    this.stocks.forEach(stock => {
      const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
      stock.price = Math.max(0, stock.price + change); // Ensure price doesn't go negative
      stock.change = (change / stock.price) * 100;

      if (stock.change > 0) {
        stock.color = 'green';
      } else if(stock.change< 0){
        stock.color = 'red';
      }
      else{
        stock.color = 'yellow'
      }
    });
  }
}
