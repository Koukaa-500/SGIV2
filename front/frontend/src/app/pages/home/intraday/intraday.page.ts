import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
Chart.register(...registerables);

@Component({
  selector: 'app-intraday',
  templateUrl: './intraday.page.html',
  styleUrls: ['./intraday.page.scss'],
})
export class IntradayPage implements OnInit {

  symbol: string;
  chart: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.symbol = this.route.snapshot.paramMap.get('symbol')!;
  }

  ngOnInit() {
    this.symbol = this.route.snapshot.paramMap.get('symbol')!;
    this.fetchStockPriceHistory();
  }

  fetchStockPriceHistory() {
    const apiUrl = `http://localhost:3000/product/history/${this.symbol}`;
    this.http.get<any[]>(apiUrl).subscribe(
      data => {
        const labels = data.map(entry => new Date(entry.timestamp));
        const prices = data.map(entry => entry.price);

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
                  unit: 'minute'
                }
              }
            }
          }
        });
      },
      error => {
        console.error('Failed to fetch stock price history:', error);
      }
    );
  }
}
