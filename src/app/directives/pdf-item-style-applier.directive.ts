import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, Subscription } from 'rxjs';
import {
  PdfItem,
  ContainerElement,
  PdfItemType,
  TextElement,
  ImageElement,
  RowElement,
  CheckElement,
} from '../models';
import { PdfItemService } from '../services/pdf-item.service';
import { LineElement } from '../models/line';

@Directive({
  selector: '[PdfItemStyleApplier]',
})
export class PdfItemStyleApplier implements OnInit, OnDestroy {
  @Input({ required: true, alias: 'PdfItemStyleApplier' })
  pdfItem!: PdfItem;
  subscription!: Subscription;
  unit = 'pt';
  constructor(private el: ElementRef, private pdfItemService: PdfItemService) {}

  ngOnInit(): void {
    this.applyStyles();
    this.subscription = this.pdfItem.changed$
      .pipe(debounceTime(300))
      .subscribe(() => this.applyStyles());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private applyStyles(): void {
    const { pb, pl, pr, pt, uId } = this.pdfItem;
    const element = this.el.nativeElement as HTMLElement;

    element.setAttribute('data-id', uId);

    // element.style.borderTop = `${bt}${this.unit}`;
    // element.style.borderBottom = `${bb}${this.unit}`;
    // element.style.borderLeft = `${bl}${this.unit}`;
    // element.style.borderRight = `${br}${this.unit}`;

    // if (bColor) {
    //   element.style.borderColor = bColor;
    //   element.style.borderStyle = 'solid';
    // }

    if ((this.pdfItem as ContainerElement).isParent) {
      element.style.paddingTop = `${pt}${this.unit}`;
      element.style.paddingLeft = `${pl}${this.unit}`;
      element.style.paddingRight = `${pr}${this.unit}`;
      element.style.paddingBottom = `${pb}${this.unit}`;
    } else {
      element.style.marginTop = `${pt}${this.unit}`;
      element.style.marginLeft = `${pl}${this.unit}`;
      element.style.marginRight = `${pr}${this.unit}`;
      element.style.marginBottom = `${pb}${this.unit}`;
    }
    if (this.isTextElement(this.pdfItem)) {
      const { fontSize, bold, italics, color, lineHeight, alignment } =
        this.pdfItem;
      const { color: defaultColor, lineHeight: defaultLineHeight } =
        this.pdfItemService.defaultStyles;
      element.style.fontSize = `${
        fontSize ?? this.pdfItemService.defaultStyles.fontSize
      }${this.unit}`;
      element.style.fontWeight = bold ? '600' : '400';
      element.style.fontStyle = italics ? 'italic' : '';
      element.style.textAlign = alignment ?? '';
      element.style.lineHeight = (lineHeight ?? defaultLineHeight).toString();
      element.style.color = color ?? defaultColor;
    }

    if (this.isContainerElement(this.pdfItem)) {
      const { color, bgColor, alignment } = this.pdfItem;
      element.style.color = `${color}`;
      element.style.backgroundColor = `${bgColor}`;
      element.style.alignItems = `${
        alignment == 'left' ? 'start' : alignment == 'right' ? 'end' : alignment
      }`;
    }

    if (this.isImageElement(this.pdfItem)) {
      const { width, height, src } = this.pdfItem;
      element.style.width = `${width}${this.unit}`;
      element.style.height = `${height}${this.unit}`;
      element.style.backgroundImage = src ? `url(${src})` : '';
    }

    if (this.isLineElement(this.pdfItem)) {
      const { x1, x2, y1, y2, lineWidth, lineColor } = this.pdfItem;
      element.setAttribute('x1', `${x1}`);
      element.setAttribute('y1', `${y1}`);
      element.setAttribute('x2', `${x2}`);
      element.setAttribute('y2', `${y2}`);
      element.setAttribute('stroke-width', `${lineWidth}`);
      element.setAttribute('stroke', lineColor ?? 'black');
      element.parentElement!.setAttribute(
        'height',
        `${Math.abs(y2 - y1) || lineWidth}`
      );
      element.parentElement!.setAttribute(
        'width',
        `${Math.abs(x2 - x1) || lineWidth}`
      );
    }

    if (this.isRowElement(this.pdfItem)) {
      const { columnGap } = this.pdfItem;
      element.style.gap = `${columnGap ?? 0}${this.unit}`;
    }

    if (this.isCheckElement(this.pdfItem)) {
      const { fontSize } = this.pdfItem;
      const input = element.querySelector('input')!;
      input.style.fontSize = `${
        fontSize ?? this.pdfItemService.defaultStyles.fontSize
      }${this.unit}`;
      input.style.lineHeight = `1`;
    }
  }

  isTextElement(ele: PdfItem): ele is TextElement {
    return ele.type == PdfItemType.TEXT;
  }

  isRowElement(ele: PdfItem): ele is RowElement {
    return ele.type == PdfItemType.ROW;
  }

  isImageElement(ele: PdfItem): ele is ImageElement {
    return ele.type == PdfItemType.IMAGE;
  }

  isContainerElement(ele: PdfItem): ele is ContainerElement {
    return ele.type == PdfItemType.CONTAINER;
  }

  isLineElement(ele: PdfItem): ele is LineElement {
    return ele.type == PdfItemType.LINE;
  }

  isCheckElement(ele: PdfItem): ele is CheckElement {
    return ele.type == PdfItemType.CHECK;
  }
}
