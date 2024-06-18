import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage{

  stocks: any[] = [];
  stockSymbols: string[] = ['AAPL', 'GOOGL', 'MSFT'];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadStockData();
    setInterval(() => {
      this.loadStockData();
    }, 300000); // Refresh every 5 minutes
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
}
