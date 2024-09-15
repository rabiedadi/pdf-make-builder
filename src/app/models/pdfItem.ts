import { Subject } from 'rxjs';
import { uuid } from '../helpers';

export enum PdfItemType {
  TEXT = 'text',
  CONTAINER = 'container',
  CHECK = 'check',
  IMAGE = 'image',
  ROW = 'row',
}

export type PdfItemSettings = {
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;
  bt?: number;
  bb?: number;
  bl?: number;
  br?: number;
  bColor?: string;
};

export class PdfItem {
  uId: string;
  changed$ = new Subject<void>();
  private _bColor: string = '#000000';

  get bColor() {
    return this._bColor;
  }
  set bColor(bColor: string) {
    this._bColor = bColor;
    this.changed$.next();
  }

  /* --------------------------------- borders -------------------------------- */
  private _bt = 0;
  private _bb = 0;
  private _bl = 0;
  private _br = 0;
  get bt() {
    return this._bt;
  }
  set bt(bt: number) {
    this._bt = bt;
    this.changed$.next();
  }
  get bb() {
    return this._bb;
  }
  set bb(bb: number) {
    this._bb = bb;
    this.changed$.next();
  }
  get bl() {
    return this._bl;
  }
  set bl(bl: number) {
    this._bl = bl;
    this.changed$.next();
  }
  get br() {
    return this._br;
  }
  set br(br: number) {
    this._br = br;
    this.changed$.next();
  }
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
    return {
      pt: this.pt,
      pb: this.pb,
      pl: this.pl,
      pr: this.pr,
      bt: this.bt,
      bb: this.bb,
      bl: this.bl,
      br: this.br,
      bColor: this.bColor,
    };
  }

  readonly iconName: string;

  private iconsMap: { [key in PdfItemType]: string } = {
    text: 'text_fields',
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
    settings.bColor != undefined && (this.bColor = settings.bColor);
    settings.bt != undefined && (this.bt = settings.bt);
    settings.bb != undefined && (this.bb = settings.bb);
    settings.bl != undefined && (this.bl = settings.bl);
    settings.br != undefined && (this.br = settings.br);
    settings.pt != undefined && (this.pt = settings.pt);
    settings.pb != undefined && (this.pb = settings.pb);
    settings.pl != undefined && (this.pl = settings.pl);
    settings.pr != undefined && (this.pr = settings.pr);
  }

  clone(deep?: boolean): PdfItem {
    throw new Error("Method 'clone()' not implemented");
  }
}

export class dragPdfItem extends PdfItem {
  isClone?: boolean;
}
