import { Component } from '@angular/core';
import { PdfItemComponentBase } from '../pdf-item-component-base.class';
import { CheckElement } from '../../models';

@Component({
  selector: 'app-pdf-check',
  templateUrl: './pdf-check.component.html',
  styleUrls: ['./pdf-check.component.scss'],
})
export class PdfCheckComponent extends PdfItemComponentBase<CheckElement> {
  constructor() {
    super();
  }
}
