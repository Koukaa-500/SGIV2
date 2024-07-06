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
  constructor(private route: ActivatedRoute, private http: HttpClient , private router:Router,private navCtrl: NavController,private productService : ProductService ) {
    this.symbol = this.route.snapshot.paramMap.get('symbol')!;
    this.stockData = this.productService.getStockBySymbol(this.symbol);
  }

  ngOnInit() {
    this.fetchTransactionData();
  }

  fetchTransactionData() {
    const apiUrl = `http://10.1.1.68:3000/product/history/${this.symbol}`;
    this.http.get<any[]>(apiUrl).subscribe(
      data => {
        this.stocks = data;
      },
      error => {
        console.error('Failed to fetch transaction data:', error);
      }
    );
  }

  goToTransaction() {
    this.router.navigate(['transaction']);
  }

  goToProfond() {
    this.router.navigate(['profondeur']);
  }

  goToIntraday(symbol: string) {
    this.navCtrl.navigateForward(`/intraday/${symbol}`, {
      state: { stockData: symbol }
    });
  }
}
