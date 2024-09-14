import { PdfItem, PdfItemSettings, PdfItemType, dragPdfItem } from './pdfItem';
import { ContainerElement } from './container';
import { RowElement } from './row';
import { ImageElement } from './image';
import { TextElement } from './text';
import { CheckElement } from './check';

interface PdfElementConstructor {
  new (): PdfItem;
}

export const pdfItemTypeMapper: {
  [key in PdfItemType]: PdfElementConstructor;
} = {
  text: TextElement,
  check: CheckElement,
  image: ImageElement,
  row: RowElement,
  container: ContainerElement,
};

export {
  PdfItem,
  PdfItemSettings,
  PdfItemType,
  dragPdfItem,
  ContainerElement,
  RowElement,
  ImageElement,
  TextElement,
  CheckElement,
};
