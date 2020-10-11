import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgeDocService } from '../../../nge-doc.service';

@Component({
  selector: 'nge-doc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    @Output() toggle = new EventEmitter();
    state$ = this.api.stateChanges;
    constructor(
        readonly api: NgeDocService
    ) {}
}
