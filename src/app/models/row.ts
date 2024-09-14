import { uuid } from '../helpers';
import { ContainerElement } from './container';
import { PdfItem, PdfItemSettings, PdfItemType } from './pdfItem';

type RowItemSettings = {
  rowType?: 'header' | 'content' | 'footer';
};

export class RowElement extends PdfItem {
  private _rowType: 'header' | 'content' | 'footer' | undefined;

  constructor(
    public cols: number[] = [6, 6],
    settings?: PdfItemSettings & RowItemSettings
  ) {
    super(PdfItemType.ROW, settings ?? { pt: 0, pb: 0, pr: 0, pl: 0 });
    this.setRowSettings(settings);
    for (let i = 0; i < cols.length; i++) {
      this.addColumn(cols[i]);
    }
  }

  columns: ContainerElement[] = [];
  verticalAlign: 'top' | 'bottom' | 'middle' = 'top';

  get rowType() {
    return this._rowType;
  }
  set rowType(rowType: RowItemSettings['rowType']) {
    this._rowType = rowType;
    this.changed$.next();
  }

  get remainingCols() {
    return Math.max(
      12 - this.columns.reduce((acc, col) => acc + col.cols, 0),
      0
    );
  }

  setRowSettings(settings: RowItemSettings = {}) {
    settings.rowType !== undefined && (this.rowType = settings.rowType);
  }

  addColumn(col?: number, index?: number) {
    if (this.columns.length == 6) return;
    col = col ?? Math.min(2, this.remainingCols);
    index = index !== undefined ? index : this.columns.length;
    this.columns.splice(index, 0, new ContainerElement(col));
  }

  delColumn(uId: string) {
    const index = this.columns.findIndex((c) => c.uId == uId);
    this.columns.splice(index, 1);
  }

  flipColumns(uId: string, direction: 1 | -1) {
    const index = this.columns.findIndex((c) => c.uId == uId);
    const container1 = this.columns[index];
    const container2 = this.columns[index + direction];
    if (container1 && container2) {
      const tmp = container1;
      this.columns[index] = container2;
      this.columns[index + direction] = tmp;
      const tmp2 = this.cols[index];
      this.cols[index] = this.cols[index + direction];
      this.cols[index + direction] = tmp2;
    }
  }

  override clone(): RowElement {
    const { columns, ...rest } = this;
    return Object.assign(new RowElement(this.cols), {
      ...rest,
      uId: uuid(),
    });
  }
}
