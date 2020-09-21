import { Component, OnInit } from '@angular/core';
import { NgeDocService } from './nge-doc.service';

@Component({
    selector: 'nge-doc',
    template: `<nge-doc-default-layout></nge-doc-default-layout>`,
    providers: [NgeDocService],
})
export class NgeDocComponent implements OnInit {
    constructor(
        private readonly navigation: NgeDocService,
    ) {}

    async ngOnInit() {
        await this.navigation.setup();
    }
}
