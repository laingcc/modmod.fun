import {Component, OnDestroy} from '@angular/core';
import {Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-destroyable',
  standalone: true,
  imports: [],
  template: ''
})
export class Destroyable implements OnDestroy{

  public unsubscribe$ = new Subject<void>();

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
