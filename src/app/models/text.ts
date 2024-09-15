import { uuid } from '../helpers';
import { PdfItem, PdfItemSettings, PdfItemType } from './pdfItem';

type TextItemSettings = {
  fontSize?: number;
  bold?: boolean;
  italics?: boolean;
  color?: string;
} & PdfItemSettings;

export class TextElement extends PdfItem {
  private _fontSize = 12;
  private _bold = false;
  private _italics = false;
  private _color = '#484848';

  constructor(public content = '', settings?: TextItemSettings) {
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

  get settings(): TextItemSettings {
    return {
      ...this.parentSettings,
      fontSize: this.fontSize,
      italics: this.italics,
      color: this.color,
      bold: this.bold,
    };
  }

  setTextSettings(settings: TextItemSettings = {}) {
    settings.fontSize !== undefined && (this.fontSize = settings.fontSize);
    settings.italics !== undefined && (this.italics = settings.italics);
    settings.color !== undefined && (this.color = settings.color);
    settings.bold !== undefined && (this.bold = settings.bold);
  }

  override clone(deep?: boolean): TextElement {
    const clone = Object.assign(new TextElement(), {
      uId: uuid(),
    });
    if (deep) {
      Object.assign(clone, {
        ...this.settings,
        content: this.content,
      });
    }
    return clone;
  }
}
