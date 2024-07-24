import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage implements OnInit {
  symbol: string;
  stocks: any[] = [];
  quantity: any;
  validity:any;
  stockData:any;
  stock:any;
  activeFilter: string = '';
  filteredStocks: any[] = [];
  constructor(private route: ActivatedRoute, private http: HttpClient , private router:Router,private navCtrl: NavController,private productService : ProductService ) {
    this.symbol = '';
    this.stockData = this.productService.getStockBySymbol(this.symbol);
    this.stock={};
  }

  ngOnInit() {
    this.symbol = this.route.snapshot.paramMap.get('symbol')!;
    this.stock = this.productService.getStockBySymbol(this.symbol);
    this.fetchTransactionData();
  }

  fetchTransactionData() {
    const apiUrl = `http://192.168.1.199:3000/product/history/${this.symbol}`;
    this.http.get<any[]>(apiUrl).subscribe(
      data => {
        this.stocks = data;
      },
      error => {
        console.error('Failed to fetch transaction data:', error);
      }
    );
  }

  

  goToProfond(symbol: string) {
    this.navCtrl.navigateForward(`/profondeur/${symbol}`, {
      state: { stockData: symbol }
    });
  }

  goToIntraday(symbol: string) {
    this.navCtrl.navigateForward(`/intraday/${symbol}`, {
      state: { stockData: symbol }
    });
  }

  navigateBack(){
    this.router.navigate(['/home'])
  }
  toggleFavorite(event: Event, stock: any) {
    try {
      event.stopPropagation(); // Stops event propagation
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

  filterStocks(option: string): void {
    switch (option) {
      case 'priceHighToLow':
        this.filteredStocks = [...this.stocks.sort((a, b) => b.price - a.price)];
        break;
        case 'change':
          this.filteredStocks = [...this.stocks.sort((a, b) => b.change - a.change)];
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
