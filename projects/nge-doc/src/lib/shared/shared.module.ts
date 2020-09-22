import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgeDocLogoComponent } from './logo/logo.component';
import { NgeDocRendererComponent } from './renderer/renderer.component';

@NgModule({
    imports: [CommonModule],
    exports: [NgeDocLogoComponent, NgeDocRendererComponent],
    declarations: [NgeDocLogoComponent, NgeDocRendererComponent],
})
export class NgeDocSharedModule { }
