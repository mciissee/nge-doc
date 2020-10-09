import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgeDocRendererComponent } from './renderer/renderer.component';
import { NgeDocTocDirective } from './renderer/toc.directive';

const declarations = [
    NgeDocRendererComponent,
    NgeDocTocDirective,
];
@NgModule({
    imports: [CommonModule],
    exports: declarations,
    declarations,
})
export class NgeDocSharedModule { }
