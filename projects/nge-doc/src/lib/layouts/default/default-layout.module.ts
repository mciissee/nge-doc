import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// MODULE
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';

import { DefaultLayoutComponent } from './default-layout.component';
import { NgeDocSharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [
        FooterComponent,
        HeaderComponent,
        SidenavComponent,
        DefaultLayoutComponent,
    ],
    exports: [DefaultLayoutComponent],
    imports: [
        CommonModule,
        RouterModule,
        NgeDocSharedModule,
    ],
})
export class DefaultLayoutModule { }
