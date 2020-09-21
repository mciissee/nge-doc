import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'nge-doc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    @Output() toggle = new EventEmitter();
}
