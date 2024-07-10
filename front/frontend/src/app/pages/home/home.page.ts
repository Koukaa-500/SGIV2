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
  stockSymbols: string[] = ['AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA', 'FB', 'NFLX', 'NVDA', 'BABA', 'INTC', 'PYPL', 'UBER', 'DIS', 'ORCL', 'CSCO', 'ADBE', 'CRM'];
  intervalId: any;
  lastSavedTime: any;
  status: any;
  title: string = 'Marché';
  activeFilter: string = '';
  filteredStocks: any[] = [];

  constructor(
    private productService: ProductService,
    private authService: AuthenticationService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  async ngOnInit(): Promise<void> {
    this.lastSavedTime = 0;
    this.loadUserProfile();
    this.loadStockData();
    (await this.productService.getFavoriteStocks()).subscribe(
      () => {
        this.stocks = this.productService.stocks; // Update local stocks array with the latest data
      },
      error => {
        console.error('Error fetching favorite stocks:', error);
      }
    );
    this.intervalId = setInterval(() => {
      this.updateStockPrices();
    }, 1000);
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
      }
    );
  }


  async toggleFavorite(stock: any) {
    try {
      this.productService.toggleFavorite(stock.symbol,!stock.favorite);

      // Update stocks array to reflect the change
      const index = this.stocks.findIndex(s => s.symbol === stock.symbol);
      if (index !== -1) {
        this.stocks[index].favorite = !this.stocks[index].favorite;
      }
    } catch (error) {
      console.error(`Failed to update favorite status for ${stock.symbol}:`, error);
      // Rollback UI state if needed
    }
  }

  

  loadStockData() {
    this.stocks = [];
    this.stockSymbols.forEach(symbol => {
      const stock = this.productService.getStockBySymbol(symbol);
      if (stock) {
        this.stocks.push(stock);
      }
    });
    this.filteredStocks = [...this.stocks]; // Initialize filtered stocks with all stocks

  }

  buy(stock: any) {
    // Navigate to the "Buy" page and pass the stock data
    this.navCtrl.navigateForward(`/buy/${stock.symbol}`, {
      state: { stockData: stock }
    });
  }

  sell(stock: any) {
    // Navigate to the "Sell" page and pass the stock data
    this.navCtrl.navigateForward(`/sell/${stock.symbol}`, {
      state: { stockData: stock }
    });
  }

  updateStockPrices() {
    const currentTime = Date.now();
    const tenSeconds = 20000;
  
    if (!this.lastSavedTime || currentTime - this.lastSavedTime >= tenSeconds) {
      this.stocks.forEach(stock => {
        let change;
  
        // Increase the range of change and add more probability to have a zero change
        const random = Math.random();
        if (random < 0.3) {
          // 30% chance to have zero change
          change = 0;
        } else {
          // 70% chance to have a random change between -10 and 10
          change = (Math.random() - 0.5) * 20;
        }
  
        // Ensure price doesn't go negative
        stock.price = Math.max(0, stock.price + change);
  
        // Save to database via backend API (mocked here)
        this.productService.saveStockPrice(stock.symbol, stock.price, stock.change).subscribe(
          response => {
            console.log("succsuss")
          },
          error => {
            console.log("fail");
          }
        );
  
        // Update change logic
        stock.change = (change / (stock.price - change)) * 100; // Adjusted change percentage calculation
  
        // Update color logic
        if (stock.status === 'Non-Disponible') {
          stock.color = 'red';
        } else {
          stock.color = stock.change > 0 ? 'green' : (stock.change < 0 ? 'red' : '#E1A624');
        }
      });
  
      this.lastSavedTime = currentTime;
    } else {
      this.stocks.forEach(stock => {
        const change = (Math.random() - 0.5) * 10; // Random change between -1 and 1
        stock.price = Math.max(0, stock.price + change); // Ensure price doesn't go negative
  
        // Update change logic
        stock.change = (change / stock.price) * 100;
  
        // Update color logic
        if (stock.status === 'Non-Disponible') {
          stock.color = 'red';
        } else {
          stock.color = stock.change > 0 ? 'green' : (stock.change < 0 ? 'red' : '#E1A624');
        }
      });
    }
    this.filteredStocks = [...this.stocks];
  }

  goToIntraday(symbol: string) {
    this.navCtrl.navigateForward(`/intraday/${symbol}`, {
      state: { stockData: symbol }
    });
  }

  filterStocks(option: string): void {
    switch (option) {
      case 'priceHighToLow':
        this.filteredStocks = [...this.stocks.sort((a, b) => b.price - a.price)];
        break;
      case 'alphabetical':
        this.filteredStocks = [...this.stocks.sort((a, b) => a.symbol.localeCompare(b.symbol))];
        break;
      case 'favorites':
        this.filteredStocks = this.stocks.filter(stock => stock.favorite);
        break;
      default:
        this.filteredStocks = [...this.stocks];
        break;
    }
    
    this.activeFilter = option; // Set active filter
  }
  clearFilters(): void {
    this.filteredStocks = [...this.stocks]; // Reset filtered stocks to all stocks
    this.activeFilter = ''; // Clear active filter
  }

}
