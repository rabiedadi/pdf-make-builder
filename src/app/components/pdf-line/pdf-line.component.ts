import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LineElement } from '../../models';
import { PdfItemComponentBase } from '../pdf-item-component-base.class';

@Component({
  selector: 'app-pdf-line',
  templateUrl: './pdf-line.component.html',
  styleUrls: ['./pdf-line.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfLineComponent extends PdfItemComponentBase<LineElement> {
  constructor() {
    super();
  }
}
