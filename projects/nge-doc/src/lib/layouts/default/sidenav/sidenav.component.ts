import { Component } from '@angular/core';
import { NgeDocLink } from '../../../nge-doc';
import {
    NgeDocService
} from '../../../nge-doc.service';

@Component({
    selector: 'nge-doc-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
    state$ = this.doc.stateChanges;

    constructor(
        readonly doc: NgeDocService
    ) {}

    trackBy(_: number, item: NgeDocLink) {
        return item.href;
    }
}
