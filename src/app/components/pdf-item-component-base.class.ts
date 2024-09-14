import { Component, Input } from '@angular/core';
import { PdfItem } from '../models';

@Component({
  template: '',
})
export abstract class PdfItemComponentBase<TItem = PdfItem> {
  @Input({ required: true }) control!: TItem;
}
