import { Component, OnInit } from '@angular/core';
import { PdfItemComponentBase } from '../pdf-item-component-base.class';
import { pdfTree } from '../../models';

@Component({
  selector: 'app-pdf-image',
  templateUrl: './pdf-image.component.html',
  styleUrls: ['./pdf-image.component.scss'],
})
export class PdfImageComponent
  extends PdfItemComponentBase<pdfTree.ImageElement>
  implements OnInit
{
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
