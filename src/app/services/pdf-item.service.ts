import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  PdfItem,
  ContainerElement,
  PdfItemType,
  TextElement,
  CheckElement,
  ImageElement,
  RowElement,
} from '../models';
import { LineElement } from '../models/line';

interface PdfElementConstructor {
  new (...data: any): PdfItem;
}

@Injectable({ providedIn: 'root' })
export class PdfItemService {
  parentContainer$ = new BehaviorSubject<ContainerElement | undefined>(
    undefined
  );
  focusedElement$ = new BehaviorSubject<PdfItem | undefined>(undefined);

  hasHeader = true;
  hasFooter = true;
  defaultStyles = {
    lineHeight: 1,
    fontSize: 10,
    color: '#000000',
  };

  public pdfItems: { [key in PdfItemType]: PdfElementConstructor } = {
    line: LineElement,
    text: TextElement,
    check: CheckElement,
    image: ImageElement,
    container: ContainerElement,
    row: RowElement,
  };

  init() {
    this.parentContainer$.next(
      this.createPdfItem(PdfItemType.CONTAINER, {
        pt: 35,
        pr: 20,
        pb: 35,
        pl: 20,
      })
    );
    this.parentContainer$.value!.isParent = true;
    this.parentContainer$.value!.elements.push(
      this.createPdfItem(PdfItemType.ROW, [12], {
        rowType: 'header',
      }),
      this.createPdfItem(PdfItemType.ROW, [12], {
        rowType: 'content',
      }),
      this.createPdfItem(PdfItemType.ROW, [12], {
        rowType: 'footer',
      })
    );
  }

  public createPdfItem<T = PdfItem>(type: PdfItemType, ...data: any): T {
    return new this.pdfItems[type](...(data as any)) as T;
  }
}
