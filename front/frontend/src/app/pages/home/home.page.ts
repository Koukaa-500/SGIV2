import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  name: string | undefined;
  stocks: any[] = [];
  stockSymbols: string[] = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'FB','AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'FB'];
  intervalId: any;
  lastSavedTime:any;
  newStocks: any[] = [];

  constructor(
    private productService: ProductService,
    private authService: AuthenticationService,
    private router: Router,
    private navCtrl: NavController
  ) {
   
  }

  ngOnInit(): void {
    this.lastSavedTime = 0;
    this.loadUserProfile();
    this.loadStockData();
    this.intervalId = setInterval(() => {
      this.updateStockPrices();
    }, 1000);
    // this.loadStockData();
    // setInterval(() => {
    //   this.loadStockData();
    // }, 300000); // Refresh every 5 minutes
    // this.loadUserProfile();
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
      const stock = this.productService.getStockBySymbol(symbol);
      if (stock) {
        this.stocks.push(stock);
      }
    });
  }

  buy(stock: any) {
    // Navigate to the "Product" page and pass the stock data
    this.navCtrl.navigateForward(`/buy/${stock.symbol}`, {
      state: { stockData: stock }
    });
  }

  sell(stock:any) {
    this.navCtrl.navigateForward(`/sell/${stock.symbol}`, {
      state: { stockData: stock }
    });
  }

  updateStockPrices() {
    const currentTime = Date.now();
    const tenSeconds = 10000;
  
    if (!this.lastSavedTime || currentTime - this.lastSavedTime >= tenSeconds) {
      this.stocks.forEach(stock => {
        const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
        stock.price = Math.max(0, stock.price + change); // Ensure price doesn't go negative
  
        // Save to database via backend API
        this.productService.saveStockPrice(stock.symbol, stock.price).subscribe(
          response => {
            console.log(`Price saved successfully for ${stock.symbol}`);
          },
          error => {
            console.error(`Failed to save price for ${stock.symbol}:`, error);
          }
        );
  
        // Update color logic as before
        stock.change = (change / stock.price) * 100;
        if (stock.change > 0) {
          stock.color = 'green';
        } else if (stock.change < 0) {
          stock.color = 'red';
        } else {
          stock.color = 'yellow';
        }
      });
  
      this.lastSavedTime = currentTime;
    } else {
      this.stocks.forEach(stock => {
        const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
        stock.price = Math.max(0, stock.price + change); // Ensure price doesn't go negative
  
        // Update color logic as before
        stock.change = (change / stock.price) * 100;
        if (stock.change > 0) {
          stock.color = 'green';
        } else if (stock.change < 0) {
          stock.color = 'red';
        } else {
          stock.color = 'yellow';
        }
      });
    }
  }
  
  goToIntraday(symbol: string) {
    this.router.navigate(['/intraday', symbol]);
  }
}
