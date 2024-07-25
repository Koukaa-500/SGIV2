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
  filteredStocks: any[] = [];
  selectedStockDetails: any = null;
  user: any;
  currentDate: string | undefined;
  isMarketOpen: boolean | undefined;
  espece: number = 0;
  titre: number = 0;
  activeFilter: string = '';
  stocks: any[] = [];
  showChart: boolean = false;
  today: Date = new Date();
  totalChange: number = 0;
  totalSA: number = 0;
  availabilityStatus: string = '';
  searchTerm: string = '';
  isSearchExpanded: boolean = false;
  isChartVisible = false;

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.formattedValue}`;
          }
        }
      }
    }
  };

  pieChartLegend = true;
  pieChartPlugins = [];
  
  public pieChartLabels: string[] = [];
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
    }]
  };
  
  public pieChartType: ChartType = 'pie';

  constructor(private accountsService: AccountsService, private elementRef: ElementRef) { }

  ngOnInit() {
    this.getAccounts();
    this.user = this.accountsService.getUserData();
    console.log(this.user);
    this.updateAvailabilityStatus();
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
    this.filteredStocks = [...this.selectedStocks];
    this.calculateEspece();
    this.calculateTitre();
    this.updatePieChart();
  }

  onAccountChange(event: Event) {
    const accountId = (event.target as HTMLSelectElement).value;
    this.selectedAccount = this.accounts.find(account => account._id === accountId);
    if (this.selectedAccount) {
      this.selectedStocks = this.selectedAccount.stock;
      this.filteredStocks = [...this.selectedStocks];
      this.calculateEspece();
      this.calculateTitre();
      this.updatePieChart();
    } else {
      this.selectedStocks = [];
      this.filteredStocks = [];
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
    
    this.activeFilter = option;
  }

  filterStock() {
    if (this.searchTerm.trim() === '') {
      this.filteredStocks = [...this.selectedStocks];
    } else {
      this.filteredStocks = this.selectedStocks.filter(stock =>
        stock.symbol.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  clearFilters(): void {
    this.filteredStocks = [...this.selectedStocks];
    this.activeFilter = '';
    this.isSearchExpanded = false;
  }

  toggleSearch() {
    this.isSearchExpanded = !this.isSearchExpanded;
    if (this.isSearchExpanded) {
      setTimeout(() => {
        const searchInput = this.elementRef.nativeElement.querySelector('ion-searchbar input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 300);
    }
  }

  updateAvailabilityStatus() {
    const dayOfWeek = this.today.getDay();
    const hourOfDay = this.today.getHours();
    if (dayOfWeek === 0 || dayOfWeek === 6 || (dayOfWeek === 5 && hourOfDay >= 18) || (dayOfWeek === 1 && hourOfDay < 9)) {
      this.availabilityStatus = 'Closed';
    } else {
      this.availabilityStatus = 'Open';
    }
  }
}
