import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Trade } from '../common/position.model';



@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private readonly apiUrl = 'https://localhost:7114/api/Portfolio';
  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}
 
  markpostion(trade: Trade): Observable<Trade> {
    return this.http.post<Trade>(`${this.apiUrl}/MarkPosition`, trade, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

 
  getpostions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetPositions`).pipe(
      catchError(this.handleError)
    );
  }

  /** Error handler */
  private handleError(error: HttpErrorResponse) {
    let msg = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      msg = `Client-side error: ${error.error.message}`;
    } else {
      msg = `Server error (${error.status}): ${error.message}`;
    }
    console.error(msg);
    return throwError(() => new Error(msg));
  }
}