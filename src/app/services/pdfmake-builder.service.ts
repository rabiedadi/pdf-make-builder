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

@Injectable({ providedIn: 'root' })
export class PdfMakeBuilderService {
  unit = 'pt';
  async build(item: PdfItem): Promise<Object> {
    switch (item.type) {
      case PdfItemType.CONTAINER:
        return this.buildContainer(item as ContainerElement);
      case PdfItemType.ROW:
        return this.buildRow(item as RowElement);
      case PdfItemType.IMAGE:
        return this.BuildImage(item as ImageElement);
      case PdfItemType.TEXT:
        return this.BuildText(item as TextElement);
      case PdfItemType.CHECK:
        return this.BuildCheck(item as CheckElement);
      default:
        return {};
    }
  }

  private async BuildImage(ele: ImageElement) {
    const uri = await getDataUriFromImageUrl(ele.src);
    return {
      image: uri,
      cover: {
        width: ele.width,
        height: ele.height,
        valign: 'center',
        align: 'center',
      },
      ...this.marginsBuilder(ele),
      ...this.bordersBuilder(ele),
      ...this.styleBuilder(ele),
    };
  }

  private async BuildText(ele: TextElement) {
    return {
      text: ele.content,
      ...this.marginsBuilder(ele),
      ...this.bordersBuilder(ele),
      ...this.styleBuilder(ele),
    };
  }

  private async BuildCheck(ele: CheckElement) {
    const checkPoint = await getDataUriFromImageUrl(
      'https://images.vexels.com/content/129762/preview/check-flat-icon-29a00a.png'
    );
    return {
      table: {
        widths: [10, '*'],
        body: [
          [
            {
              image: checkPoint,
              width: 10,
              height: 10,
              fillColor: '#E8E8E8',
              border: [false],
              alignment: 'center',
            },
            {
              text: ele.content,
              border: [false],
              borderColor: ['', '', '', '#E8E8E8'],
              fontSize: 9,
            },
          ],
        ],
        ...this.marginsBuilder(ele),
        ...this.bordersBuilder(ele),
        ...this.styleBuilder(ele),
      },
      border: [false],
    };
  }

  private async buildContainer(ele: ContainerElement) {
    if (ele.isParent) {
      const rows = ele.elements as unknown as RowElement[];
      return {
        version: '1.7',
        pageSize: 'A4',
        defaultStyle: { lineHeight: 1.3 },
        pageMargins: [ele.pl, ele.pt, ele.pr, ele.pb],
        header: await this.build(rows.find((r) => r.rowType === 'header')!),
        content: await this.build(rows.find((r) => r.rowType === 'content')!),
        footer: await this.build(rows.find((r) => r.rowType === 'footer')!),
      };
    } else {
      const elements = await Promise.all(
        ele.elements.map((item: PdfItem) => this.build(item))
      );
      return {
        table: {
          headerRows: 1,
          widths: ['*'],
          body: elements.length ? [...elements.map((e) => [e])] : [[]],
        },
        ...this.marginsBuilder(ele),
        ...this.bordersBuilder(ele),
        ...this.styleBuilder(ele),
      };
    }
  }

  private async buildRow(ele: RowElement) {
    const columns = await Promise.all(
      ele.columns.map((column) => this.build(column))
    );
    console.log(columns);
    console.log(ele.cols);

    return {
      columns: ele.cols.map((col, i) => ({
        ...columns[i],
        width: (col * 100) / 12 + '%',
      })),
      // columnGap: 10
      ...this.marginsBuilder(ele),
      ...this.bordersBuilder(ele),
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

  private bordersBuilder({ bl, bt, br, bb, bColor }: PdfItem) {
    return bl || bt || br || bb
      ? {
          border: [!!bl, !!bt, !!br, !!bb],
          borderColor: [bColor, bColor, bColor, bColor],
        }
      : { border: [false] };
  }

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
        const { color, bgColor } = item as ContainerElement;
        if (color) styles['color'] = color;
        if (bgColor) styles['fillColor'] = bgColor;
        break;
      }
    }
    return styles;
  }
}
