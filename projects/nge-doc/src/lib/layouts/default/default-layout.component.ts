import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'nge-doc-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
    private subscription?: Subscription;
    opened = true;

    constructor(
        private readonly observer: BreakpointObserver
    ) {}

    ngOnInit() {
         this.observer.observe([
            Breakpoints.Small,
        ]).subscribe(result => {
            if (result.matches) {
                this.opened = false;
            }
        });
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }
}
