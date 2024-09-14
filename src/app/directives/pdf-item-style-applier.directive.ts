import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  PdfItem,
  ContainerElement,
  PdfItemType,
  TextElement,
  ImageElement,
} from '../models';

@Directive({
  selector: '[PdfItemStyleApplier]',
})
export class PdfItemStyleApplier implements OnInit, OnDestroy {
  @Input({ required: true, alias: 'PdfItemStyleApplier' })
  pdfItem!: PdfItem;
  subscription!: Subscription;
  unit = 'pt';
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

    element.style.borderTop = `${bt}${this.unit}`;
    element.style.borderBottom = `${bb}${this.unit}`;
    element.style.borderLeft = `${bl}${this.unit}`;
    element.style.borderRight = `${br}${this.unit}`;

    if (bColor) {
      element.style.borderColor = bColor;
      element.style.borderStyle = 'solid';
    }

    if ((this.pdfItem as ContainerElement).isParent) {
      element.style.paddingTop = `${pt}${this.unit}`;
      element.style.paddingBottom = `${pb}${this.unit}`;
      element.style.paddingLeft = `${pl}${this.unit}`;
      element.style.paddingRight = `${pr}${this.unit}`;
    } else {
      element.style.marginTop = `${pt}${this.unit}`;
      element.style.marginBottom = `${pb}${this.unit}`;
      element.style.marginLeft = `${pl}${this.unit}`;
      element.style.marginRight = `${pr}${this.unit}`;
    }
    if (type == PdfItemType.TEXT) {
      const { fontSize, bold, italics, color } = this.pdfItem as TextElement;
      element.style.fontSize = `${fontSize}${this.unit}`;
      element.style.fontWeight = bold ? '500' : '400';
      element.style.fontStyle = italics ? 'italic' : '';
      element.style.color = `${color}`;
    }

    if (type == PdfItemType.CONTAINER) {
      const { color, bgColor } = this.pdfItem as ContainerElement;
      element.style.color = `${color}`;
      element.style.backgroundColor = `${bgColor}`;
    }

    if (type == PdfItemType.IMAGE) {
      const { width, height, src } = this.pdfItem as ImageElement;
      element.style.width = `${width}${this.unit}`;
      element.style.height = `${height}${this.unit}`;
      element.style.backgroundImage = src ? `url(${src})` : '';
    }

    if (type == PdfItemType.CHECK) {
    }
  }
}
