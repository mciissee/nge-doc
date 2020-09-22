import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// LIBS
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

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

        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
    ],
})
export class DefaultLayoutModule { }
