import { uuid } from '../helpers';
import { PdfItem, PdfItemSettings, PdfItemType } from './pdfItem';

export type Alignment = 'left' | 'right' | 'justify' | 'center';

export type TextItemSettings = {
  content?: string;
  preview?: string;
  link?: string;
  fontSize?: number;
  lineHeight?: number;
  alignment?: Alignment;
  bold?: boolean;
  italics?: boolean;
  color?: string;
} & PdfItemSettings;

export class TextElement extends PdfItem {
  private _fontSize: number | undefined;
  private _lineHeight: number | undefined;
  private _alignment: Alignment | undefined;
  private _bold: boolean | undefined;
  private _italics: boolean | undefined;
  private _color: string | undefined;
  content = '';
  preview = '';
  link = '';
  constructor(settings?: TextItemSettings) {
    super(PdfItemType.TEXT, settings ?? { pt: 0, pb: 0, pr: 0, pl: 0 });
    this.setTextSettings(settings);
  }

  get fontSize() {
    return this._fontSize;
  }
  set fontSize(v: number | undefined) {
    this._fontSize = v;
    this.changed$.next();
  }
  get bold() {
    return this._bold;
  }
  set bold(v: boolean | undefined) {
    this._bold = v;
    this.changed$.next();
  }
  get italics() {
    return this._italics;
  }
  set italics(v: boolean | undefined) {
    this._italics = v;
    this.changed$.next();
  }
  get color() {
    return this._color;
  }
  set color(v: string | undefined) {
    this._color = v;
    this.changed$.next();
  }

  get lineHeight() {
    return this._lineHeight;
  }
  set lineHeight(v: number | undefined) {
    this._lineHeight = v;
    this.changed$.next();
  }

  get alignment() {
    return this._alignment;
  }
  set alignment(v: Alignment | undefined) {
    this._alignment = v;
    this.changed$.next();
  }

  get settings(): TextItemSettings {
    return {
      ...this.parentSettings,
      content: this.content,
      preview: this.preview,
      alignment: this.alignment,
      link: this.link,
      fontSize: this.fontSize,
      lineHeight: this.lineHeight,
      color: this.color,
      italics: this.italics || undefined,
      bold: this.bold || undefined,
    };
  }

  setTextSettings(settings: TextItemSettings = {}) {
    this.content = settings.content ?? '';
    this.preview = settings.preview ?? '';
    this.alignment = settings.alignment;
    this.link = settings.link ?? '';
    settings.fontSize !== undefined && (this.fontSize = settings.fontSize);
    settings.lineHeight !== undefined &&
      (this.lineHeight = settings.lineHeight);
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
      });
    }
    return clone;
  }
}
