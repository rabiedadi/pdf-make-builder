import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { pdfTree } from '../models';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[PdfItemStyleApplier]',
})
export class PdfItemStyleApplier implements OnInit, OnDestroy {
  @Input({ required: true, alias: 'PdfItemStyleApplier' })
  pdfItem!: pdfTree.PdfItem;
  subscription!: Subscription;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.applyStyles();
    this.subscription = this.pdfItem.changed$.subscribe(() =>
      this.applyStyles()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private applyStyles(): void {
    const { bColor, bb, bl, br, bt, pb, pl, pr, pt, uId, type } = this.pdfItem;
    const element = this.el.nativeElement as HTMLElement;

    element.setAttribute('data-id', uId);

    element.style.borderTop = `${bt}px`;
    element.style.borderBottom = `${bb}px`;
    element.style.borderLeft = `${bl}px`;
    element.style.borderRight = `${br}px`;

    if (bColor) {
      element.style.borderColor = bColor;
      element.style.borderStyle = 'solid';
    }

    element.style.paddingTop = `${pt}px`;
    element.style.paddingBottom = `${pb}px`;
    element.style.paddingLeft = `${pl}px`;
    element.style.paddingRight = `${pr}px`;

    if (type == pdfTree.PdfItemType.TEXT) {
      const { fontSize, fontWeight, color } = this
        .pdfItem as pdfTree.TextElement;
      element.style.fontSize = `${fontSize}px`;
      element.style.fontWeight = `${fontWeight}px`;
      element.style.color = `${color}`;
    }

    if (type == pdfTree.PdfItemType.CONTAINER) {
      const { color, bgColor } = this.pdfItem as pdfTree.ContainerElement;
      element.style.color = `${color}`;
      element.style.backgroundColor = `${bgColor}`;
    }

    if (type == pdfTree.PdfItemType.IMAGE) {
      const { width, height, src } = this.pdfItem as pdfTree.ImageElement;
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
      element.style.backgroundImage = src ? `url(${src})` : '';
    }

    if (type == pdfTree.PdfItemType.CHECK) {
    }
  }
}
