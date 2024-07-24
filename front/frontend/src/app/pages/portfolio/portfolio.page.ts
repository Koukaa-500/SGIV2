import { Component, ElementRef, OnInit } from '@angular/core';
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
  activeFilter: string = '';
  filteredStocks: any[] = [];
  stocks: any[] = [];
  showChart: boolean = false;
  today: Date = new Date();
  totalChange: number = 0;
  totalSA: number = 0;
  availabilityStatus: string = '';
  searchTerm: string = '';
  isSearchExpanded: boolean = false;
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

  constructor(private accountsService: AccountsService,private elementRef: ElementRef, ) { }

  ngOnInit() {
    this.getAccounts();
    this.user = this.accountsService.getUserData();
    console.log(this.user);
    this.updateAvailabilityStatus()
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

  filterStocks(option: string): void {
    switch (option) {
      case 'priceHighToLow':
        this.filteredStocks = [...this.selectedStocks.sort((a, b) => b.price - a.price)];
        break;
        case 'alphabetical':
          this.filteredStocks = [...this.selectedStocks.sort((a, b) => a.symbol.localeCompare(b.symbol))];
          break;
      case 'favorites':
        this.filteredStocks = this.selectedStocks.filter(stock => stock.favorite);
        break;
      default:
        this.filteredStocks = [...this.selectedStocks];
        break;
    }
    
    this.activeFilter = option; // Set active filter
  }
  filterStock() {
    if (this.searchTerm.trim() === '') {
      this.filteredStocks = this.selectedStocks; // Reset to all stocks when search term is empty
    } else {
      this.filteredStocks = this.selectedStocks.filter(stock =>
        stock.symbol.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  clearFilters(): void {
    this.filteredStocks = [...this.stocks]; // Reset filtered stocks to all stocks
    this.activeFilter = ''; // Clear active filter
    this.isSearchExpanded=false
  }
  toggleSearch() {
    this.isSearchExpanded = !this.isSearchExpanded;
    if (this.isSearchExpanded) {
      setTimeout(() => {
        const searchInput = this.elementRef.nativeElement.querySelector('ion-searchbar input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 300); // Delay to ensure expansion transition completes
    }
  }
 

  updateAvailabilityStatus(): void {
    const currentHour = new Date().getHours();
    this.availabilityStatus = (currentHour > 6 && currentHour < 20) ? 'Disponible' : 'Non-Disponible';
   
  }
  formatChange(change: number): string {
    const prefix = change > 0 ? '+' : (change < 0 ? '-' : '');
    const color = change > 0 ? 'green' : (change < 0 ? 'red' : '');
    return `${color}${prefix}${Math.abs(change).toFixed(2)}%`;
  }
}
