import {
  CheckItemSettings,
  ContainerItemSettings,
  ImageItemSettings,
  LineItemSettings,
  RowItemSettings,
  TextItemSettings,
} from '.';
import { PdfItemType } from './pdfItem';

export type ImageHistoryItem = {
  type: PdfItemType.IMAGE;
  settings: ImageItemSettings;
};
export type TextHistoryItem = {
  type: PdfItemType.TEXT;
  settings: TextItemSettings;
};
export type LineHistoryItem = {
  type: PdfItemType.LINE;
  settings: LineItemSettings;
};
export type CheckHistoryItem = {
  type: PdfItemType.CHECK;
  settings: CheckItemSettings;
};
export type ContainerHistoryItem = {
  type: PdfItemType.CONTAINER;
  settings: ContainerItemSettings;
  elements: HistoryItem[];
  isParent?: boolean;
};
export type RowHistoryItem = {
  type: PdfItemType.ROW;
  settings: RowItemSettings;
  columns: ContainerHistoryItem[];
  cols: number[];
};

export type HistoryItem =
  | RowHistoryItem
  | LineHistoryItem
  | TextHistoryItem
  | ImageHistoryItem
  | CheckHistoryItem
  | ContainerHistoryItem;
