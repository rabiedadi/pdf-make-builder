import { uuid } from '../helpers';
import { ContainerElement } from './container';
import { PdfItem, PdfItemSettings, PdfItemType } from './pdfItem';

export type RowItemSettings = {
  rowType?: 'header' | 'content' | 'footer';
  columnGap?: number;
} & PdfItemSettings;

export class RowElement extends PdfItem {
  public columns: ContainerElement[] = [];
  private _rowType: 'header' | 'content' | 'footer' | undefined;
  private _columnGap?: number;

  constructor(
    public cols: number[] = [6, 6],
    settings?: RowItemSettings,
    columns?: ContainerElement[]
  ) {
    super(PdfItemType.ROW, settings ?? { pt: 0, pb: 0, pr: 0, pl: 0 });
    this.setRowSettings(settings);
    columns ? (this.columns = columns) : this.initColumns(cols);
  }

  get rowType() {
    return this._rowType;
  }
  set rowType(rowType: RowItemSettings['rowType']) {
    this._rowType = rowType;
    this.changed$.next();
  }

  get columnGap() {
    return this._columnGap;
  }
  set columnGap(columnGap: RowItemSettings['columnGap']) {
    this._columnGap = columnGap;
    this.changed$.next();
  }

  get remainingCols() {
    return Math.max(
      12 - this.columns.reduce((acc, _, i) => acc + this.cols[i], 0),
      0
    );
  }

  get settings(): RowItemSettings {
    return {
      ...this.parentSettings,
      rowType: this.rowType,
      columnGap: this.columnGap,
    };
  }

  setRowSettings(settings: RowItemSettings = {}) {
    settings.rowType !== undefined && (this.rowType = settings.rowType);
  }

  initColumns(cols: number[]) {
    for (let i = 0; i < cols.length; i++) {
      this.addColumn(cols[i]);
    }
  }

  addColumn(col?: number, index?: number) {
    if (this.remainingCols < 2 || this.columns.length == 6) return;
    col = col ?? Math.min(2, this.remainingCols);
    index = index !== undefined ? index : this.columns.length;
    this.columns.splice(index, 0, new ContainerElement());
    !col && this.cols.splice(index, 0, col);
  }

  delColumn(uId: string) {
    const index = this.columns.findIndex((c) => c.uId == uId);
    this.columns.splice(index, 1);
    this.cols.splice(index, 1);
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

  override clone(deep?: boolean): RowElement {
    const clone = Object.assign(new RowElement([...this.cols]), {
      uId: uuid(),
    });
    if (deep) {
      Object.assign<RowElement, Partial<RowElement>>(clone, {
        ...this.settings,
        columns: this.columns.map((c) => c.clone(true)),
      });
    }
    return clone;
  }
}
