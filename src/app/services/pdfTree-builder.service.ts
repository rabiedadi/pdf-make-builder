import { Injectable } from '@angular/core';
import { getDataUriFromImageUrl } from '../helpers/getDataUriFromImageUrl';
import {
  PdfItem,
  PdfItemType,
  ContainerElement,
  RowElement,
  ImageElement,
  TextElement,
  CheckElement,
  LineElement,
} from '../models';
import {
  CheckHistoryItem,
  ContainerHistoryItem,
  HistoryItem,
  ImageHistoryItem,
  LineHistoryItem,
  RowHistoryItem,
  TextHistoryItem,
} from '../models/history';

@Injectable({ providedIn: 'root' })
export class PdfTreeBuilderService {
  /**
   * Builds a history tree from a PdfItem.
   * The history tree is a simplified representation of the PDF structure.
   * @param item - The PDF item to convert into a history item.
   * @returns The history item representing the given PdfItem.
   */
  createHistoryFromItem(item: PdfItem): HistoryItem {
    switch (item.type) {
      case PdfItemType.CONTAINER:
        return this.buildContainer(item as ContainerElement);
      case PdfItemType.ROW:
        return this.buildRow(item as RowElement);
      case PdfItemType.IMAGE:
        return this.buildImage(item as ImageElement);
      case PdfItemType.TEXT:
        return this.buildText(item as TextElement);
      case PdfItemType.CHECK:
        return this.BuildCheck(item as CheckElement);
      case PdfItemType.LINE:
        return this.buildLine(item as LineElement);
    }
  }

  private buildImage(ele: ImageElement): ImageHistoryItem {
    return {
      type: PdfItemType.IMAGE,
      settings: ele.settings,
    };
  }

  private buildText(ele: TextElement): TextHistoryItem {
    return {
      type: PdfItemType.TEXT,
      settings: ele.settings,
    };
  }

  private buildLine(ele: LineElement): LineHistoryItem {
    return {
      type: PdfItemType.LINE,
      settings: ele.settings,
    };
  }

  private BuildCheck(ele: CheckElement): CheckHistoryItem {
    return {
      type: PdfItemType.CHECK,
      settings: ele.settings,
    };
  }

  private buildContainer(ele: ContainerElement): ContainerHistoryItem {
    return {
      type: PdfItemType.CONTAINER,
      settings: ele.settings,
      elements: ele.elements.map((item) => this.createHistoryFromItem(item)),
      isParent: ele.isParent || undefined,
    };
  }

  private buildRow(ele: RowElement): RowHistoryItem {
    return {
      type: PdfItemType.ROW,
      settings: ele.settings,
      columns: ele.columns.map(
        (item) => this.createHistoryFromItem(item) as ContainerHistoryItem
      ),
      cols: ele.cols,
    };
  }

  /**
   * Builds a PdfItem from a HistoryItem. This reverses the process of `buildTree`.
   * It constructs the original PDF structure from its simplified history representation.
   * @param item - The HistoryItem to convert back into a PdfItem.
   * @returns The PdfItem reconstructed from the history item.
   */
  reconstructItemFromHistory(item: HistoryItem): PdfItem {
    switch (item.type) {
      case PdfItemType.IMAGE:
        return new ImageElement(item.settings);

      case PdfItemType.TEXT:
        return new TextElement(item.settings);

      case PdfItemType.CHECK:
        return new CheckElement(item.settings);

      case PdfItemType.LINE:
        return new LineElement(item.settings);

      case PdfItemType.ROW:
        const columns = item.columns.map(
          (c) => this.reconstructItemFromHistory(c) as ContainerElement
        );
        return new RowElement(item.cols, item.settings, columns);
      case PdfItemType.CONTAINER:
        const elements = item.elements.map((e) =>
          this.reconstructItemFromHistory(e)
        );
        const container = Object.assign<
          ContainerElement,
          Partial<ContainerElement>
        >(new ContainerElement(item.settings), {
          elements,
          isParent: item.isParent,
        });
        return container;
    }
  }
}
