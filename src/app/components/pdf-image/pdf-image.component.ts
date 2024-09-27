import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PdfItemComponentBase } from '../pdf-item-component-base.class';
import { ImageElement } from '../../models';
import { takeUntil } from 'rxjs';

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
  destroyRef = inject(DestroyRef);
  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.control.changed$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.detectChanges());
  }
}
