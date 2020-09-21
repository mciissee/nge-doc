import { Component } from '@angular/core';
import { NgeDocService } from '../../../nge-doc.service';

@Component({
    selector: 'nge-doc-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
})
export class MainComponent {
    readonly state$ = this.doc.stateChanges;

    constructor(private readonly doc: NgeDocService) {}

    type(o: any) {
        return typeof(o);
    }
}
