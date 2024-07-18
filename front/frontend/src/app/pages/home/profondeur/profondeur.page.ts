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
  stockData: any;
  profondeurData: any[] = []; // Add this property to hold profondeur data

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
   
    private router: Router,
    private navCtrl: NavController
  ) {
    this.symbol = '';
    this.stockData = {};
    this.stock = {};
  }

  ngOnInit() {
    this.symbol = this.route.snapshot.paramMap.get('symbol')!;
    this.stock = this.productService.getStockBySymbol(this.symbol);
    this.loadProfondeurData(); // Load profondeur data on init
  }

  async loadProfondeurData() {
    try {
      const response = await this.productService.getProfondeurBySymbol(this.symbol).toPromise();
      this.profondeurData = response;
      console.log('Profondeur data:', this.profondeurData);
    } catch (error) {
      console.error('Error loading profondeur data:', error);
    }
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
