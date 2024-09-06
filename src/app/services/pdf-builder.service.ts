import { Injectable } from '@angular/core';
import { pdfTree } from '../models';

@Injectable({ providedIn: 'root' })
export class PdfBuilderService {
  build(item: pdfTree.PdfItem): string {
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
        return '';
    }
  }

  BuildImage(item: pdfTree.ImageElement) {
    return `<img 
      data-pdfmake='{"fit":[100,100]}'
      src="${item.src}" 
      style="${this.styleBuilder(item)}"
    >`;
  }

  BuildText(item: pdfTree.TextElement) {
    return `
    <p style="${this.styleBuilder(item)}">
      ${item.content}
    </p>`;
  }

  BuildCheck(item: pdfTree.CheckElement) {
    console.log(444);
    return `
      <div>
        <input style="${this.styleBuilder(item)}" type="checkbox" checked />
        <label for="scales">${item.content}</label>
      </div>
    `;
  }

  buildContainer(item: pdfTree.ContainerElement): string {
    return `
    <div style="${this.styleBuilder(item)}">
      ${item.elements.map((ele: pdfTree.PdfItem) => this.build(ele)).join('')}
    </div>`;
  }

  buildRow(item: pdfTree.RowElement) {
    return `
    <table style="${this.styleBuilder(item)}">
      <tr>
        ${item.columns
          .map(
            (ele: pdfTree.ContainerElement) => `
          <td style="
            width: ${(ele.cols * 100) / 12}%; 
            border: none;
            vertical-align: ${item.verticalAlign}  
          ">
            ${this.build(ele)}
          </td>
        `
          )
          .join('')}
      </tr>
    </table>`;
  }

  styleBuilder(item: pdfTree.PdfItem) {
    const styles: string[] = [];
    const { type, bColor, bt, bb, bl, br, pt, pb, pl, pr } = item;

    if (bColor !== undefined) styles.push(`border-color: ${bColor}`);
    if (bColor !== undefined) styles.push(`border-style: solid`);
    if (bt !== undefined) styles.push(`border-top-width: ${bt}px`);
    if (bb !== undefined) styles.push(`border-bottom-width: ${bb}px`);
    if (br !== undefined) styles.push(`border-right-width: ${br}px`);
    if (bl !== undefined) styles.push(`border-left-width: ${bl}px`);
    if (pt !== undefined) styles.push(`padding-top: ${pt}px`);
    if (pb !== undefined) styles.push(`padding-bottom: ${pb}px`);
    if (pr !== undefined) styles.push(`padding-right: ${pr}px`);
    if (pl !== undefined) styles.push(`padding-left: ${pl}px`);

    switch (type) {
      case pdfTree.PdfItemType.TEXT:
        const { fontSize, fontWeight, color } = item as pdfTree.TextElement;
        if (color) styles.push(`color: ${color}`);
        if (fontSize) styles.push(`font-size: ${fontSize}px`);
        if (fontWeight) styles.push(`font-weight: ${fontWeight}`);
        break;

      case pdfTree.PdfItemType.IMAGE: {
        const { width, height } = item as pdfTree.ImageElement;
        if (width) styles.push(`width: ${width}px`);
        if (height) styles.push(`height: ${height}px`);
        break;
      }

      case pdfTree.PdfItemType.CONTAINER:
        const { color: containerColor, bgColor } =
          item as pdfTree.ContainerElement;
        if (containerColor) styles.push(`color: ${containerColor}`);
        if (bgColor) styles.push(`background-color: ${bgColor}`);
        break;

      case pdfTree.PdfItemType.ROW:
        styles.push(`border: none`);
        styles.push(`border-spacing: 0`);
        break;
    }
    return styles.join('; ');
  }
}
