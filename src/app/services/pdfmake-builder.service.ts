import { Injectable } from '@angular/core';
import { pdfTree } from '../models';
import { getDataUriFromImageUrl } from '../helpers/getDataUriFromImageUrl';

@Injectable({ providedIn: 'root' })
export class PdfMakeBuilderService {
  unit = 'pt';
  async build(item: pdfTree.PdfItem): Promise<Object> {
    switch (item.type) {
      case pdfTree.PdfItemType.CONTAINER:
        return this.buildContainer(item as pdfTree.ContainerElement);
      case pdfTree.PdfItemType.ROW:
        return this.buildRow(item as pdfTree.RowElement);
      case pdfTree.PdfItemType.IMAGE:
        return this.BuildImage(item as pdfTree.ImageElement);
      case pdfTree.PdfItemType.TEXT:
        return this.BuildText(item as pdfTree.TextElement);
      case pdfTree.PdfItemType.CHECK:
        return this.BuildCheck(item as pdfTree.CheckElement);
      default:
        return {};
    }
  }

  private async BuildImage(ele: pdfTree.ImageElement) {
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

  private async BuildText(ele: pdfTree.TextElement) {
    return {
      text: ele.content,
      ...this.marginsBuilder(ele),
      ...this.bordersBuilder(ele),
      ...this.styleBuilder(ele),
    };
  }

  private async BuildCheck(ele: pdfTree.CheckElement) {
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

  private async buildContainer(ele: pdfTree.ContainerElement) {
    if (ele.isParent) {
      const rows = ele.elements as unknown as pdfTree.RowElement[];
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
        ele.elements.map((item: pdfTree.PdfItem) => this.build(item))
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

  private async buildRow(ele: pdfTree.RowElement) {
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

  private marginsBuilder({ pl, pt, pr, pb }: pdfTree.PdfItem) {
    return {
      margin:
        pl == pt && pt == pr && pr == pb
          ? pl
          : pl == pr && pt == pb
          ? [pl, pt]
          : [pl, pt, pr, pb],
    };
  }

  private bordersBuilder({ bl, bt, br, bb, bColor }: pdfTree.PdfItem) {
    return bl || bt || br || bb
      ? {
          border: [!!bl, !!bt, !!br, !!bb],
          borderColor: [bColor, bColor, bColor, bColor],
        }
      : { border: [false] };
  }

  private styleBuilder(item: pdfTree.PdfItem) {
    const styles: any = {};

    switch (item.type) {
      case pdfTree.PdfItemType.TEXT:
        const { fontSize, bold, italics, color } = item as pdfTree.TextElement;
        if (color) styles['color'] = color;
        if (fontSize) styles['fontSize'] = fontSize;
        if (bold) styles['bold'] = true;
        if (italics) styles['italics'] = true;
        break;

      case pdfTree.PdfItemType.IMAGE: {
        break;
      }

      case pdfTree.PdfItemType.CONTAINER: {
        const { color, bgColor } = item as pdfTree.ContainerElement;
        if (color) styles['color'] = color;
        if (bgColor) styles['fillColor'] = bgColor;
        break;
      }
    }
    return styles;
  }
}
