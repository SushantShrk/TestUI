import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card';
import { TradeService } from './services/http.services';
import { Trade } from './common/position.model';  

interface Position {
  symbol: string;
  quantity: number;
  avgPrice: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    CommonModule,
    MatCardModule,
  
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'PortiPortfolioManager';

  activeTab: 'add' | 'positions'  = 'add';

  transactions: Trade[] = [];
  currentPositions: Trade[] = [];

  newTrade: Partial<Trade> = {
    securityCode: '',
    tradeType: 'BUY',
    quantity: 1,
    operationType: 'Insert',
    version: 1
  };

  tradeOrders: Partial<Trade>[] = [];

  editIndex: number | null = null;
  cancelIndex: number | null = null;

  constructor(private httpClient: TradeService) {}

  setTab(tab: 'add' | 'positions') {
    this.activeTab = tab;
    if (tab === 'positions') {
      this.httpClient.getpostions().subscribe({
        next: (positions) => {
          console.log('Fetched positions:', positions);
          this.currentPositions = positions;
        },
        error: (err) => {
          console.error('Failed to fetch positions:', err);
        }
      });
    }
  }

  editTrade(idx: number) {
    this.editIndex = idx;
    this.newTrade = { ...this.tradeOrders[idx] };
    this.newTrade.operationType = 'Update';
  }

  cancelEdit() {
    this.editIndex = null;
    this.resetNewTrade();
  }

  prepareCancelTrade(idx: number) {
    this.cancelIndex = idx;
    this.newTrade = { ...this.tradeOrders[idx] };
     this.newTrade.operationType = 'Cancel';
    this.editIndex = null;
  }

   
  onAddOrUpdateCancleTrade(operationType:string='Insert') {
    const t: Trade = {
      transactionID: this.newTrade.transactionID,
      tradeID: this.newTrade.tradeID,
      version: this.newTrade.version,
      securityCode: (this.newTrade.securityCode || '').toUpperCase().trim(),
      tradeType: (this.newTrade.tradeType as 'BUY' | 'SELL') || 'BUY',
      quantity: Number(this.newTrade.quantity ?? 0),
      operationType: this.newTrade.operationType || 'Insert'
    };
    if (!t.securityCode || t.quantity! <= 0) {
      return;
    }


    this.httpClient.markpostion(t).subscribe({
        next: (positions) => {
          console.log('Fetched positions:', positions);
           this.tradeOrders.push({ ...positions });
        },
        error: (err) => {
          console.error('Failed to fetch positions:', err);
        }
      });
 
    this.resetNewTrade();
  }
 

  resetNewTrade() {
    this.newTrade = {
      securityCode: '',
      tradeType: 'BUY',
      quantity: 1,
      operationType: 'Insert',
      version: 1
    };
    this.editIndex = null;
    this.cancelIndex = null;
  }

    isTradeIdCancelled(tradeID: any): boolean {
    return this.tradeOrders.some(
      t => t.tradeID === tradeID && t.operationType === 'Cancel'
    );
  }

 
}
