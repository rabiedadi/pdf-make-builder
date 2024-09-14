import { Component, OnInit } from '@angular/core';
import { PdfItemService } from '../../services/pdf-item.service';
import { PdfItemComponentBase } from '../pdf-item-component-base.class';
import { PdfItem, RowElement } from '../../models';

@Component({
  selector: 'app-pdf-row',
  templateUrl: './pdf-row.component.html',
  styleUrls: ['./pdf-row.component.scss'],
})
export class PdfRowsComponent
  extends PdfItemComponentBase<RowElement>
  implements OnInit
{
  focusedElement = this.pdfItemService.focusedElement$;
  constructor(private pdfItemService: PdfItemService) {
    super();
  }

  ngOnInit(): void {}

  setFocusedElement(element: PdfItem) {
    this.pdfItemService.focusedElement$.next(element);
  }
}
