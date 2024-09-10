import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { pdfTree } from '../models';

interface PdfElementConstructor {
  new (...data: any): pdfTree.PdfItem;
}

@Injectable({ providedIn: 'root' })
export class PdfItemService {
  parentContainer$ = new BehaviorSubject<pdfTree.ContainerElement | undefined>(
    undefined
  );
  focusedElement$ = new BehaviorSubject<pdfTree.PdfItem | undefined>(undefined);

  hasHeader = true;
  hasFooter = true;

  public pdfItems: { [key in pdfTree.PdfItemType]: PdfElementConstructor } = {
    text: pdfTree.TextElement,
    check: pdfTree.CheckElement,
    image: pdfTree.ImageElement,
    container: pdfTree.ContainerElement,
    row: pdfTree.RowElement,
  };

  init() {
    this.parentContainer$.next(
      this.createPdfItem(pdfTree.PdfItemType.CONTAINER, 12, {
        pt: 35,
        pr: 20,
        pb: 35,
        pl: 20,
        isParent: true,
      })
    );
    this.parentContainer$.value!.elements.push(
      this.createPdfItem(pdfTree.PdfItemType.ROW, [12], {
        rowType: 'header',
      }),
      this.createPdfItem(pdfTree.PdfItemType.ROW, [12], {
        rowType: 'content',
      }),
      this.createPdfItem(pdfTree.PdfItemType.ROW, [12], {
        rowType: 'footer',
      })
    );
  }

  public createPdfItem<T = pdfTree.PdfItem>(
    type: pdfTree.PdfItemType,
    ...data: any
  ): T {
    return new this.pdfItems[type](...(data as any)) as T;
  }
}
