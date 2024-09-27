import { uuid } from '../helpers';
import { PdfItem, PdfItemSettings, PdfItemType } from './pdfItem';

export type LineItemSettings = {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  lineWidth?: number;
  lineColor?: string;
} & PdfItemSettings;

export class LineElement extends PdfItem {
  private _x1 = 0;
  private _y1 = 1;
  private _x2 = 100;
  private _y2 = 1;
  private _lineWidth = 2;
  private _lineColor: string | undefined;

  constructor(settings?: LineItemSettings) {
    super(PdfItemType.LINE, settings ?? { pt: 0, pb: 0, pr: 0, pl: 0 });
    this.setLineSettings(settings);
  }

  get x1() {
    return this._x1;
  }
  set x1(x1: number) {
    this._x1 = x1;
    this.changed$.next();
  }

  get y1() {
    return this._y1;
  }
  set y1(y1: number) {
    this._y1 = y1;
    this.changed$.next();
  }

  get x2() {
    return this._x2;
  }
  set x2(x2: number) {
    this._x2 = x2;
    this.changed$.next();
  }

  get y2() {
    return this._y2;
  }
  set y2(y2: number) {
    this._y2 = y2;
    this.changed$.next();
  }

  get lineWidth() {
    return this._lineWidth;
  }
  set lineWidth(lineWidth: number) {
    this._lineWidth = lineWidth;
    this.changed$.next();
  }

  get lineColor() {
    return this._lineColor;
  }
  set lineColor(lineColor: string | undefined) {
    this._lineColor = lineColor;
    this.changed$.next();
  }

  get settings(): LineItemSettings {
    return {
      ...this.parentSettings,
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
      lineWidth: this.lineWidth,
      lineColor: this.lineColor,
    };
  }

  setLineSettings(settings: LineItemSettings = {}) {
    settings.x1 !== undefined && (this.x1 = settings.x1);
    settings.y1 !== undefined && (this.y1 = settings.y1);
    settings.x2 !== undefined && (this.x2 = settings.x2);
    settings.y2 !== undefined && (this.y2 = settings.y2);
    settings.lineWidth !== undefined && (this.lineWidth = settings.lineWidth);
    settings.lineColor !== undefined && (this.lineColor = settings.lineColor);
  }

  override clone(deep?: boolean): LineElement {
    const clone = Object.assign(new LineElement(), {
      uId: uuid(),
    });
    if (deep) {
      Object.assign(clone, {
        ...this.settings,
      });
    }
    return clone;
  }
}
