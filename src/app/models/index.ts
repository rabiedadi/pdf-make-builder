import { PdfItem, PdfItemSettings, PdfItemType, dragPdfItem } from './pdfItem';
import { ContainerElement, ContainerItemSettings } from './container';
import { RowElement, RowItemSettings } from './row';
import { ImageElement, ImageItemSettings } from './image';
import { TextElement, TextItemSettings } from './text';
import { CheckElement, CheckItemSettings } from './check';
import { LineElement, LineItemSettings } from './line';

interface PdfElementConstructor {
  new (): PdfItem;
}

export const pdfItemTypeMapper: {
  [key in PdfItemType]: PdfElementConstructor;
} = {
  text: TextElement,
  check: CheckElement,
  image: ImageElement,
  line: LineElement,
  row: RowElement,
  container: ContainerElement,
};

export {
  PdfItem,
  PdfItemSettings,
  PdfItemType,
  dragPdfItem,
  ContainerElement,
  LineElement,
  RowElement,
  ImageElement,
  TextElement,
  CheckElement,
  RowItemSettings,
  ImageItemSettings,
  TextItemSettings,
  CheckItemSettings,
  ContainerItemSettings,
  LineItemSettings,
};
