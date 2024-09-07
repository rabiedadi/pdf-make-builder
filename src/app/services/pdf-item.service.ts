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
  Header$ = new BehaviorSubject<pdfTree.ContainerElement | undefined>(
    undefined
  );
  footer$ = new BehaviorSubject<pdfTree.ContainerElement | undefined>(
    undefined
  );
  focusedElement$ = new BehaviorSubject<pdfTree.PdfItem | undefined>(undefined);

  public pdfItems: { [key in pdfTree.PdfItemType]: PdfElementConstructor } = {
    text: pdfTree.TextElement,
    check: pdfTree.CheckElement,
    image: pdfTree.ImageElement,
    container: pdfTree.ContainerElement,
    row: pdfTree.RowElement,
  };

  init() {
    this.parentContainer$.next(
      this.createPdfItem(
        pdfTree.PdfItemType.CONTAINER,
        12, // cols
        {}, // containerSettings
        {
          pt: 20,
          pb: 20,
          pr: 20,
          pl: 20,
        }
      )
    );
    this.Header$.next(this.createPdfItem(pdfTree.PdfItemType.CONTAINER));
    this.footer$.next(this.createPdfItem(pdfTree.PdfItemType.CONTAINER));
  }

  public createPdfItem<T = pdfTree.PdfItem>(
    type: pdfTree.PdfItemType,
    ...data: any
  ): T {
    return new this.pdfItems[type](...(data as any)) as T;
  }
}
