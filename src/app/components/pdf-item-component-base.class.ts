import { Component, Input } from '@angular/core';
import { pdfTree } from '../models';

@Component({
  template: '',
})
export abstract class PdfItemComponentBase<TItem = pdfTree.PdfItem> {
  @Input({ required: true }) control!: TItem;
}
