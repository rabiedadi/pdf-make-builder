import { Subject } from 'rxjs';
import { uuid } from '../helpers';

export enum PdfItemType {
  TEXT = 'text',
  CONTAINER = 'container',
  LINE = 'line',
  CHECK = 'check',
  IMAGE = 'image',
  ROW = 'row',
}

export type PdfItemSettings = {
  p?: number;
  px?: number;
  py?: number;
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;
};

export class PdfItem {
  uId: string;
  changed$ = new Subject<void>();

  /* -------------------------------- paddings -------------------------------- */
  private _pt = 0;
  private _pb = 0;
  private _pl = 0;
  private _pr = 0;

  get pt() {
    return this._pt;
  }
  set pt(pt: number) {
    this._pt = pt;
    this.changed$.next();
  }
  get pb() {
    return this._pb;
  }
  set pb(pb: number) {
    this._pb = pb;
    this.changed$.next();
  }
  get pl() {
    return this._pl;
  }
  set pl(pl: number) {
    this._pl = pl;
    this.changed$.next();
  }
  get pr() {
    return this._pr;
  }
  set pr(pr: number) {
    this._pr = pr;
    this.changed$.next();
  }

  get parentSettings(): PdfItemSettings {
    return this.pt == this.pb && this.pl == this.pb && this.pl == this.pr
      ? { p: this.pt }
      : this.pt == this.pb && this.pl == this.pr
      ? {
          px: this.pl,
          py: this.pt,
        }
      : {
          pt: this.pt,
          pb: this.pb,
          pl: this.pl,
          pr: this.pr,
        };
  }

  readonly iconName: string;

  private iconsMap: { [key in PdfItemType]: string } = {
    text: 'text_fields',
    line: 'horizontal_rule',
    image: 'image',
    check: 'check_box',
    row: 'view_week',
    container: 'view_stream',
  };

  constructor(public type: PdfItemType, settings?: PdfItemSettings) {
    this.uId = uuid();
    this.iconName = this.iconsMap[type];
    settings && this.setSettings(settings);
  }

  setSettings(settings: PdfItemSettings) {
    const { p, py, px, pt, pb, pl, pr } = settings;

    if (p !== undefined) {
      this.pt = this.pb = this.pl = this.pr = p;
    } else {
      if (py !== undefined) {
        this.pt = this.pb = py;
      }
      if (px !== undefined) {
        this.pl = this.pr = px;
      }
      if (pt !== undefined) this.pt = pt;
      if (pb !== undefined) this.pb = pb;
      if (pl !== undefined) this.pl = pl;
      if (pr !== undefined) this.pr = pr;
    }
  }

  clone(_deep?: boolean): PdfItem {
    throw new Error("Method 'clone()' not implemented");
  }
}

export class dragPdfItem extends PdfItem {
  isClone?: boolean;
}
