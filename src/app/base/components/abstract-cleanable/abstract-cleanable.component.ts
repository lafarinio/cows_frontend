import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export abstract class AbstractCleanableComponent implements OnDestroy {

  private subscription = new Subscription();

  ngOnDestroy(): void {
    this.clean();
  }

  protected addSubscription(subscription: Subscription) {
    this.subscription.add(subscription);
  }

  private clean(): void {
    this.subscription.unsubscribe();
  }

}
