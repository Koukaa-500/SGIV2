import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-profondeur',
  templateUrl: './profondeur.page.html',
  styleUrls: ['./profondeur.page.scss'],
})
export class ProfondeurPage implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient,private productService : ProductService,private router : Router) {
  }

  ngOnInit() {
  }
  gotToTransaction(){
    this.router.navigate(['transaction'])
  }
  gotToProfond(){
    this.router.navigate(['profondeur'])
  }
}
