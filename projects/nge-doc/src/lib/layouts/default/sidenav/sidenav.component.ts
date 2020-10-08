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
    state$ = this.api.stateChanges;

    constructor(
        readonly api: NgeDocService
    ) {}

    trackBy(_: number, item: NgeDocLink) {
        return item.href;
    }
}
