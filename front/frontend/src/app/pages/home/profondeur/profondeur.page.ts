import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-profondeur',
  templateUrl: './profondeur.page.html',
  styleUrls: ['./profondeur.page.scss'],
})
export class ProfondeurPage implements OnInit {
  stock: any;
  symbol: string;
  stockData:any;
  constructor(private route: ActivatedRoute, private http: HttpClient,private productService : ProductService,private router : Router,private navCtrl: NavController) {
    this.symbol = '';
    this.stockData = this.productService.getStockBySymbol(this.symbol);
    this.stock={};
  }

  ngOnInit() {
    this.symbol = this.route.snapshot.paramMap.get('symbol')!;
    this.stock = this.productService.getStockBySymbol(this.symbol);
  }
  goToTransaction(symbol: string) {
    this.navCtrl.navigateForward(`/transaction/${symbol}`, {
      state: { stockData: symbol }
    });
  }
  

  goToIntraday(symbol: string) {
    this.navCtrl.navigateForward(`/intraday/${symbol}`, {
      state: { stockData: symbol }
    });
  }
}
