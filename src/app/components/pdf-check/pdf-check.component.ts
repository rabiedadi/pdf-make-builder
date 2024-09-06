import { Component } from '@angular/core';
import { pdfTree } from '../../models';
import { PdfItemComponentBase } from '../pdf-item-component-base.class';

@Component({
  selector: 'app-pdf-check',
  templateUrl: './pdf-check.component.html',
  styleUrls: ['./pdf-check.component.scss'],
})
export class PdfCheckComponent extends PdfItemComponentBase<pdfTree.CheckElement> {
  constructor() {
    super();
  }
}
