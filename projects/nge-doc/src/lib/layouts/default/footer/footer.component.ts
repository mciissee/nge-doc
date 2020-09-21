import { Component } from '@angular/core';
import { NgeDocService } from '../../../nge-doc.service';

@Component({
  selector: 'nge-doc-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    readonly state$ = this.doc.stateChanges;
    constructor(private readonly doc: NgeDocService) {}
}
