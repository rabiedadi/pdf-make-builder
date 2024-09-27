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
import { PdfItemService } from './pdf-item.service';
import { parseBoldText } from '../helpers';

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
      case PdfItemType.LINE:
        return this.BuildLine(item as LineElement, _prod);
      default:
        return {};
    }
  }

  private async BuildImage(ele: ImageElement, _prod = false) {
    const uri = _prod ? ele.src : await getDataUriFromImageUrl(ele.src);
    return {
      image: uri,
      width: ele.width,
      height: ele.height,
      cover: _prod
        ? undefined
        : {
            width: ele.width,
            height: ele.height,
            valign: 'center',
            align: 'center',
          },
      ...this.marginsBuilder(ele),
      ...this.styleBuilder(ele),
      ...this.getId(ele),
      pageBreak: ele.pageBreak,
    };
  }

  private async BuildText(ele: TextElement, _prod = false) {
    const text = _prod ? ele.content : ele.preview ?? ele.content;
    return {
      text: parseBoldText(text),
      ...this.marginsBuilder(ele),
      ...this.styleBuilder(ele),
      ...this.getId(ele),
      pageBreak: ele.pageBreak,
    };
  }

  private async BuildLine(ele: LineElement, _prod = false) {
    return {
      canvas: [
        {
          type: 'line',
          x1: Math.ceil(ele.x1 / 1.333), // px to pt
          y1: Math.ceil(ele.y1 / 1.333), // px to pt
          x2: Math.ceil(ele.x2 / 1.333), // px to pt
          y2: Math.ceil(ele.y2 / 1.333), // px to pt
          lineWidth: ele.lineWidth,
          lineColor: ele.lineColor,
        },
      ],
      ...this.marginsBuilder(ele),
      ...this.styleBuilder(ele),
      ...this.getId(ele),
      pageBreak: ele.pageBreak,
    };
  }

  private async BuildCheck(ele: CheckElement, _prod = false) {
    return {
      table: {
        widths: [10, '*'],
        body: [
          [
            {
              text: _prod ? ele.value : ele.value ? '-' : 'X',
              lineHeight: 1,
              border: [true, true, true, true],
              alignment: 'center',
              fontSize: 11,
            },
            {
              text: _prod ? ele.label : ele.preview,
              border: [false],
              margin: [4, 0, 0, 0],
              lineHeight: 1,
              ...this.styleBuilder(ele),
            },
          ],
        ],
      },
      ...this.marginsBuilder(ele),
      ...this.getId(ele),
      pageBreak: ele.pageBreak,
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
        stack: elements,
        ...this.marginsBuilder(ele),
        ...this.styleBuilder(ele),
        ...this.getId(ele),
        pageBreak: ele.pageBreak,
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
      ...this.getId(ele),
      pageBreak: ele.pageBreak,
    };
  }

  private getId({ uId, type }: PdfItem) {
    return {
      id: `${type}-${uId}`,
    };
  }

  private marginsBuilder({ pl, pt, pr, pb }: PdfItem) {
    return pl || pt || pr || pb
      ? {
          margin:
            pl == pt && pt == pr && pr == pb
              ? pl
              : pl == pr && pt == pb
              ? [pl, pt]
              : [pl, pt, pr, pb],
        }
      : {};
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
    const defaultS = this.pdfItemService.defaultStyles;

    switch (item.type) {
      case PdfItemType.TEXT: {
        const { fontSize, bold, italics, color, lineHeight } =
          item as TextElement;
        if (color) styles['color'] = color;
        if (fontSize && fontSize !== defaultS.fontSize)
          styles['fontSize'] = fontSize;
        if (lineHeight && lineHeight !== defaultS.lineHeight)
          styles['lineHeight'] = lineHeight;
        if (bold) styles['bold'] = true;
        if (italics) styles['italics'] = true;
        break;
      }

      case PdfItemType.CHECK: {
        const { fontSize } = item as CheckElement;
        if (fontSize && fontSize !== defaultS.fontSize)
          styles['fontSize'] = fontSize;
        break;
      }

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
