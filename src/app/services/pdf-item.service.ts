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

  public pdfItems: { [key in PdfItemType]: PdfElementConstructor } = {
    text: TextElement,
    check: CheckElement,
    image: ImageElement,
    container: ContainerElement,
    row: RowElement,
  };

  init() {
    this.parentContainer$.next(
      this.createPdfItem(PdfItemType.CONTAINER, 12, {
        pt: 35,
        pr: 20,
        pb: 35,
        pl: 20,
        isParent: true,
      })
    );
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
