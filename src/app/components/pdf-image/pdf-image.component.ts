import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PdfItemComponentBase } from '../pdf-item-component-base.class';
import { ImageElement } from '../../models';

@Component({
  selector: 'app-pdf-image',
  templateUrl: './pdf-image.component.html',
  styleUrls: ['./pdf-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfImageComponent
  extends PdfItemComponentBase<ImageElement>
  implements OnInit
{
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
