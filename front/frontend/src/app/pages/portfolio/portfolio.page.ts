import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { AccountsService } from '../../services/accounts.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss'],
})
export class PortfolioPage implements OnInit {
  title: string = 'Portefeuille';
  accounts: any[] = [];
  selectedAccount: any = null;
  selectedStocks: any[] = [];
  selectedStockDetails: any = null;
  user: any;
  currentDate: string | undefined;
  isMarketOpen: boolean | undefined;
  espece: number = 0;
  titre: number = 0;
  showChart: boolean = false;
  isChartVisible = false; // Add this property
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true, // This ensures the legend is displayed
        position: 'top', // Adjust position if needed (top, bottom, left, right)
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            // Customize tooltips if needed
            return `${tooltipItem.label}: ${tooltipItem.formattedValue}`;
          }
        }
      }
    }
  };



  // Define other properties used in the template
  pieChartLegend = true;
  pieChartPlugins = [];
  
  public pieChartLabels: string[] = [];
  public pieChartData: ChartData<'pie'> = {
    labels: [], // These will be set dynamically
    datasets: [{
      data: [], // These will be set dynamically
      backgroundColor: [], // Array of colors for each segment
    }]
  };
  
  public pieChartType: ChartType = 'pie';

  constructor(private accountsService: AccountsService) { }

  ngOnInit() {
    this.getAccounts();
    this.user = this.accountsService.getUserData();
    console.log(this.user);
    this.updateDateAndMarketStatus();
    setInterval(() => this.updateDateAndMarketStatus(), 60000); // Update every minute
  }

  async getAccounts() {
    try {
      const accountsObservable = await this.accountsService.getAccounts();
      accountsObservable.subscribe(
        response => {
          this.accounts = response.accounts;
        },
        error => {
          console.error('Error fetching accounts:', error);
        }
      );
    } catch (error) {
      console.error('Error:', error);
    }
  }

  selectAccount(account: any) {
    this.selectedAccount = account;
    this.selectedStocks = account.stock;
    this.calculateEspece();
    this.calculateTitre();
    this.updatePieChart();
  }

  onAccountChange(event: Event) {
    const accountId = (event.target as HTMLSelectElement).value;
    this.selectedAccount = this.accounts.find(account => account._id === accountId);
    if (this.selectedAccount) {
      this.selectedStocks = this.selectedAccount.stock;
      this.calculateEspece();
      this.calculateTitre();
      this.updatePieChart();
    } else {
      this.selectedStocks = [];
      this.espece = 0;
      this.titre = 0;
    }
  }

  calculateEspece() {
    this.espece = this.selectedStocks.reduce((total, stock) => total + stock.price * stock.quantity, 0);
  }

  calculateTitre() {
    this.titre = this.selectedAccount.solde + this.espece;
  }

  updateDateAndMarketStatus() {
    const now = new Date();
    this.currentDate = now.toLocaleDateString();
    const hour = now.getHours();
    this.isMarketOpen = hour >= 6 && hour < 20;
  }

  updatePieChart() {
    if (this.selectedStocks && this.selectedStocks.length > 0) {
      this.pieChartData.labels = this.selectedStocks.map(stock => stock.symbol);
      this.pieChartData.datasets[0] = {
        data: this.selectedStocks.map(stock => stock.price * stock.quantity),
        backgroundColor: this.generateColors(this.selectedStocks.length)
      };
    } else {
      this.pieChartData.labels = [];
      this.pieChartData.datasets[0] = { data: [], backgroundColor: [] };
    }
  }
  
  generateColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`);
    }
    return colors;
  }
  

  showStockDetails(stock: any) {
    this.selectedStockDetails = stock;
  }

  toggleChart() {
    this.isChartVisible = !this.isChartVisible;
  }
}
