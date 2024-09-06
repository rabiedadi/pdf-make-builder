import { Component, OnInit } from '@angular/core';
import { pdfTree } from '../../models';
import { PdfItemComponentBase } from '../pdf-item-component-base.class';
import { PdfItemService } from '../../services/pdf-item.service';

@Component({
  selector: 'app-pdf-row',
  templateUrl: './pdf-row.component.html',
  styleUrls: ['./pdf-row.component.scss'],
})
export class PdfRowsComponent
  extends PdfItemComponentBase<pdfTree.RowElement>
  implements OnInit
{
  focusedElement = this.pdfItemService.focusedElement$;
  constructor(private pdfItemService: PdfItemService) {
    super();
  }

  ngOnInit(): void {}

  setFocusedElement(element: pdfTree.PdfItem) {
    this.pdfItemService.focusedElement$.next(element);
  }
}
