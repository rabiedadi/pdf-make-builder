import { Subject } from 'rxjs';
import { uuid } from '../helpers';

export namespace pdfTree {
  interface PdfElementConstructor {
    new (): pdfTree.PdfItem;
  }

  export enum PdfItemType {
    TEXT = 'text',
    CONTAINER = 'container',
    CHECK = 'check',
    IMAGE = 'image',
    ROW = 'row',
  }

  type PdfItemSettings = {
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

  type TextItemSettings = {
    fontSize?: number;
    bold?: boolean;
    italics?: boolean;
    color?: string;
  };

  type ImageItemSettings = {
    src?: string;
    width?: number;
  };

  type ContainerItemSettings = {
    color?: string;
    bgColor?: string;
    isParent?: string;
  };

  type RowItemSettings = {
    rowType?: 'header' | 'content' | 'footer';
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

    clone(): pdfTree.PdfItem {
      const constructorMap: Partial<Record<PdfItemType, new () => PdfItem>> = {
        text: TextElement,
        check: CheckElement,
        image: ImageElement,
        container: ContainerElement,
      };
      const Constructor = constructorMap[this.type];
      if (!Constructor) {
        throw new Error(
          `Constructor for type '${this.type}' is missing. The clone function should be overridden in the appropriate class.`
        );
      }
      const object = Object.assign(new Constructor(), {
        uId: uuid(),
      });
      return object;
    }
  }

  export class dragPdfItem extends PdfItem {
    isClone?: boolean;
  }

  /* --------------------------------- Columns -------------------------------- */
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

    override clone(): pdfTree.RowElement {
      const { columns, ...rest } = this;
      return Object.assign(new RowElement(this.cols), {
        ...rest,
        uId: uuid(),
      });
    }
  }

  /* -------------------------------- Container ------------------------------- */
  export class ContainerElement extends PdfItem {
    public elements: PdfItem[] = [];
    private _color: string | undefined;
    private _bgColor: string | undefined;
    isParent = false;
    constructor(
      public cols = 12,
      settings?: PdfItemSettings & ContainerItemSettings
    ) {
      super(PdfItemType.CONTAINER, settings ?? { pt: 0, pb: 0, pr: 0, pl: 0 });
      this.isParent = !!settings?.isParent;
      this.setContainerSettings(settings);
    }

    get color() {
      return this._color;
    }
    set color(v: string | undefined) {
      this._color = v;
      this.changed$.next();
    }
    get bgColor() {
      return this._bgColor;
    }
    set bgColor(v: string | undefined) {
      this._bgColor = v;
      this.changed$.next();
    }

    setContainerSettings(settings: ContainerItemSettings = {}) {
      settings.color !== undefined && (this._color = settings.color);
      settings.bgColor !== undefined && (this._bgColor = settings.bgColor);
    }

    override clone(): pdfTree.ContainerElement {
      const { elements, ...rest } = this;
      return Object.assign(new ContainerElement(), {
        ...rest,
        uId: uuid(),
      });
    }
  }

  /* ---------------------------------- Text ---------------------------------- */
  export class TextElement extends PdfItem {
    private _fontSize = 12;
    private _bold = false;
    private _italics = false;
    private _color = '#484848';

    constructor(
      public content = '',
      settings?: PdfItemSettings & TextItemSettings
    ) {
      super(PdfItemType.TEXT, settings ?? { pt: 4, pb: 4, pr: 0, pl: 0 });
      this.setTextSettings(settings);
    }

    get fontSize() {
      return this._fontSize;
    }
    set fontSize(v: number) {
      this._fontSize = v;
      this.changed$.next();
    }
    get bold() {
      return this._bold;
    }
    set bold(v: boolean) {
      this._bold = v;
      this.changed$.next();
    }
    get italics() {
      return this._italics;
    }
    set italics(v: boolean) {
      this._italics = v;
      this.changed$.next();
    }
    get color() {
      return this._color;
    }
    set color(v: string) {
      this._color = v;
      this.changed$.next();
    }

    setTextSettings(settings: TextItemSettings = {}) {
      settings.fontSize !== undefined && (this.fontSize = settings.fontSize);
      settings.italics !== undefined && (this.italics = settings.italics);
      settings.color !== undefined && (this.color = settings.color);
      settings.bold !== undefined && (this.bold = settings.bold);
    }
  }

  /* ---------------------------------- Image --------------------------------- */
  export class ImageElement extends PdfItem {
    private _src = '';
    private _width = 100;
    private _height = 100;

    constructor(settings?: PdfItemSettings & ImageItemSettings) {
      super(PdfItemType.IMAGE, settings);
      this.setImageSettings(settings);
    }

    get src() {
      return this._src;
    }
    set src(v: string) {
      this._src = v;
      this.changed$.next();
    }

    get height() {
      return this._height;
    }
    set height(v: number) {
      this._height = v;
      this.changed$.next();
    }

    get width() {
      return this._width;
    }
    set width(v: number) {
      this._width = v;
      this.changed$.next();
    }

    setImageSettings(settings: ImageItemSettings = {}) {
      settings.src !== undefined && (this.src = settings.src);
      settings.width !== undefined && (this.width = settings.width);
    }
  }

  /* ---------------------------------- Check --------------------------------- */
  export class CheckElement extends PdfItem {
    private _content = '';
    // here we define the question name, if empty will be set to true
    private _value = '';

    constructor() {
      super(PdfItemType.CHECK);
    }

    get content() {
      return this._content;
    }

    set content(v: string) {
      this._content = v;
      this.changed$.next();
    }

    get value() {
      return this._value;
    }

    set value(v: string) {
      this._value = v;
      this.changed$.next();
    }
  }

  export const pdfItemTypeMapper: {
    [key in pdfTree.PdfItemType]: PdfElementConstructor;
  } = {
    text: TextElement,
    check: CheckElement,
    image: ImageElement,
    row: RowElement,
    container: ContainerElement,
  };
}
