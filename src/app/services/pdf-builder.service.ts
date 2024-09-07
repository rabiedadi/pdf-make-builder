import { Injectable } from '@angular/core';
import { pdfTree } from '../models';

@Injectable({ providedIn: 'root' })
export class PdfBuilderService {
  unit = 'pt';
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
    if (bt !== undefined) styles.push(`border-top-width: ${bt}${this.unit}`);
    if (bb !== undefined) styles.push(`border-bottom-width: ${bb}${this.unit}`);
    if (br !== undefined) styles.push(`border-right-width: ${br}${this.unit}`);
    if (bl !== undefined) styles.push(`border-left-width: ${bl}${this.unit}`);
    if (pt !== undefined) styles.push(`margin-top: ${pt}${this.unit}`);
    if (pb !== undefined) styles.push(`margin-bottom: ${pb}${this.unit}`);
    if (pr !== undefined) styles.push(`margin-right: ${pr}${this.unit}`);
    if (pl !== undefined) styles.push(`margin-left: ${pl}${this.unit}`);

    switch (type) {
      case pdfTree.PdfItemType.TEXT:
        const { fontSize, bold, italics, color } = item as pdfTree.TextElement;
        if (color) styles.push(`color: ${color}`);
        if (fontSize) styles.push(`font-size: ${fontSize}${this.unit}`);
        bold && styles.push(`font-weight: 500`);
        italics && styles.push(`font-style: italic`);
        break;

      case pdfTree.PdfItemType.IMAGE: {
        const { width, height } = item as pdfTree.ImageElement;
        if (width) styles.push(`width: ${width}${this.unit}`);
        if (height) styles.push(`height: ${height}${this.unit}`);
        break;
      }

      case pdfTree.PdfItemType.CONTAINER:
        const { color: containerColor, bgColor } =
          item as pdfTree.ContainerElement;
        if (containerColor) styles.push(`color: ${containerColor}`);
        if (bgColor) styles.push(`background-color: ${bgColor}`);
        break;

      case pdfTree.PdfItemType.ROW:
        styles.push(`width: 100%`);
        styles.push(`border-spacing: 0`);
        break;
    }
    return styles.join('; ');
  }
}
