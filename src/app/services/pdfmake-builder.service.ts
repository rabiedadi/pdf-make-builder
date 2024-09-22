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
} from '../models';
import { PdfItemService } from './pdf-item.service';

@Injectable({ providedIn: 'root' })
export class PdfMakeBuilderService {
  constructor(private pdfItemService: PdfItemService) {}

  unit = 'pt';
  async build(item: PdfItem, _prod = false): Promise<Object> {
    switch (item.type) {
      case PdfItemType.CONTAINER:
        return this.buildContainer(item as ContainerElement, _prod);
      case PdfItemType.ROW:
        return this.buildRow(item as RowElement, _prod);
      case PdfItemType.IMAGE:
        return this.BuildImage(item as ImageElement, _prod);
      case PdfItemType.TEXT:
        return this.BuildText(item as TextElement, _prod);
      case PdfItemType.CHECK:
        return this.BuildCheck(item as CheckElement, _prod);
      default:
        return {};
    }
  }

  private async BuildImage(ele: ImageElement, _prod = false) {
    const uri = _prod ? ele.src : await getDataUriFromImageUrl(ele.src);
    return {
      image: uri,
      cover: {
        width: ele.width,
        height: ele.height,
        valign: 'center',
        align: 'center',
      },
      ...this.marginsBuilder(ele),
      ...this.styleBuilder(ele),
    };
  }

  private async BuildText(ele: TextElement, _prod = false) {
    return {
      text: ele.content,
      ...this.marginsBuilder(ele),
      ...this.styleBuilder(ele),
    };
  }

  private async BuildCheck(ele: CheckElement, _prod = false) {
    return {
      table: {
        widths: [10, '*'],
        body: [
          [
            {
              isTruthy: ele.value,
              text: 'X',
              lineHeight: 1,
              border: [true, true, true, true],
              alignment: 'center',
              fontSize: 11,
            },
            {
              text: ele.content,
              border: [false],
              margin: [4, 0, 0, 0],
              fontSize: 10,
              lineHeight: 1,
            },
          ],
        ],
        border: [false],
        ...this.marginsBuilder(ele),
        ...this.styleBuilder(ele),
      },
    };
  }

  private async buildContainer(ele: ContainerElement, _prod = false) {
    if (ele.isParent) {
      const rows = ele.elements as unknown as RowElement[];
      return {
        version: '1.7',
        pageSize: 'A4',
        defaultStyle: this.pdfItemService.defaultStyles,
        pageMargins: [ele.pl, ele.pt, ele.pr, ele.pb],
        header: await this.build(
          rows.find((r) => r.rowType === 'header')!,
          _prod
        ),
        content: await this.build(
          rows.find((r) => r.rowType === 'content')!,
          _prod
        ),
        footer: await this.build(
          rows.find((r) => r.rowType === 'footer')!,
          _prod
        ),
      };
    } else {
      const elements = await Promise.all(
        ele.elements.map((item: PdfItem) => this.build(item, _prod))
      );
      return {
        stack: [...elements.map((e) => [e])],
        ...this.marginsBuilder(ele),
        ...this.styleBuilder(ele),
      };
    }
  }

  private async buildRow(ele: RowElement, _prod = false) {
    const columns = await Promise.all(
      ele.columns.map((column) => this.build(column, _prod))
    );

    return {
      columns: columns.map((column, i) => ({
        width: (ele.cols[i] * 100) / 12 + '%',
        ...column,
      })),
      ...this.marginsBuilder(ele),
      ...this.styleBuilder(ele),
    };
  }

  private marginsBuilder({ pl, pt, pr, pb }: PdfItem) {
    return {
      margin:
        pl == pt && pt == pr && pr == pb
          ? pl
          : pl == pr && pt == pb
          ? [pl, pt]
          : [pl, pt, pr, pb],
    };
  }

  // private bordersBuilder({ bl, bt, br, bb, bColor, type }: PdfItem) {
  //   return bl || bt || br || bb
  //     ? {
  //         border: [!!bl, !!bt, !!br, !!bb],
  //         borderColor: [bColor, bColor, bColor, bColor],
  //       }
  //     : { border: [false] };
  // }

  private styleBuilder(item: PdfItem) {
    const styles: any = {};

    switch (item.type) {
      case PdfItemType.TEXT:
        const { fontSize, bold, italics, color } = item as TextElement;
        if (color) styles['color'] = color;
        if (fontSize) styles['fontSize'] = fontSize;
        if (bold) styles['bold'] = true;
        if (italics) styles['italics'] = true;
        break;

      case PdfItemType.IMAGE: {
        break;
      }

      case PdfItemType.CONTAINER: {
        const { color, bgColor, alignment } = item as ContainerElement;
        if (color) styles['color'] = color;
        if (bgColor) styles['fillColor'] = bgColor;
        if (alignment) styles['alignment'] = alignment;
        break;
      }

      case PdfItemType.ROW: {
        const { columnGap } = item as RowElement;
        if (columnGap) styles['columnGap'] = columnGap;
        break;
      }
    }
    return styles;
  }
}
