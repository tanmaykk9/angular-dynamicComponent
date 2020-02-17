import { Component, OnInit, OnDestroy, Input, ViewChild, ComponentFactoryResolver } from '@angular/core';

import { AdItem } from './ad-item';
import { AdComponent } from './ad.component';
import { AdDirective } from './ad.directive';

@Component({
  selector: `app-ad-banner`,
  template: `
    <div class="ad-banner">
      <h3>Advertisement</h3>
      <ng-template ad-host></ng-template>
    </div>
  `
})

export class AdBanner implements OnInit, OnDestroy {

  @Input() ads: AdItem[];
  currentAdIndex = -1;
  @ViewChild(AdDirective, {static: true}) adHost: AdDirective;
  interval: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(){
    this.loadComponent();
    this.getAds();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  loadComponent() {
    this.currentAdIndex = (this.currentAdIndex + 1) % this.ads.length;
    const adItem = this.ads[this.currentAdIndex];

    const componentFactory = 
    this.componentFactoryResolver.resolveComponentFactory(adItem.component);

    const viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<AdComponent>componentRef.instance).data = adItem.data;

  }

  getAds() {
    this.interval = setInterval(() => {
      this.loadComponent();
    }, 3000);
  }
}