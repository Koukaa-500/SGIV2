import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }
  refreshEvent = new EventEmitter<void>();

  triggerRefresh() {
    this.refreshEvent.emit();
  }
}
