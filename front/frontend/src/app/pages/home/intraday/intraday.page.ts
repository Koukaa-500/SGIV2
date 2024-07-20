import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns'; // Optional: Date-fns adapter for Chart.js
import 'chartjs-chart-financial'; // Financial chart plugin
import { ProductService } from 'src/app/services/product.service';
import { NavController } from '@ionic/angular';

Chart.register(...registerables);

@Component({
  selector: 'app-intraday',
  templateUrl: './intraday.page.html',
  styleUrls: ['./intraday.page.scss'],
})
export class IntradayPage implements OnInit {
  symbol: string;
  chart: Chart | undefined;
  stock: any;
  stocks: any[] = [];

  constructor(private navCtrl: NavController,private route: ActivatedRoute, private http: HttpClient,private productService : ProductService,private router : Router) {
    this.symbol = '';
    this.stock = {}; // Initialize stock object
  }

  ngOnInit() {
    this.symbol = this.route.snapshot.paramMap.get('symbol')!;
    this.fetchStockPriceHistory();
    // Example of fetching stock data from ProductService
    // Replace this with your actual implementation
    this.stock = this.productService.getStockBySymbol(this.symbol);
  }

  fetchStockPriceHistory() {
    const apiUrl = `http://192.168.1.112:3000/product/history/${this.symbol}`;
    this.http.get<any[]>(apiUrl).subscribe(
      data => {
        const labels = data.map(entry => new Date(entry.timestamp));
        const prices = data.map(entry => entry.price);

        this.renderLineChart(labels, prices);
      },
      error => {
        console.error('Failed to fetch stock price history:', error);
      }
    );
  }

  renderLineChart(labels: Date[], prices: number[]) {
    if (this.chart) {
      this.chart.destroy(); // Destroy previous chart instance if it exists
    }

    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: `${this.symbol} Stock Price`,
            data: prices,
            borderColor: 'blue',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'hour'
            }
          },
          y: {
            // Additional y-axis customization can be added here if needed
          }
        }
      }
    });
  }
  goToTransaction(symbol: string) {
    this.navCtrl.navigateForward(`/transaction/${symbol}`, {
      state: { stockData: symbol }
    });
  }
  
  goToProfond(symbol: string) {
    this.navCtrl.navigateForward(`/profondeur/${symbol}`, {
      state: { stockData: symbol }
    });
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
  navigateBack(){
    this.router.navigate(['/home'])
  }
}
