import { uuid } from '../helpers';
import { PdfItem, PdfItemSettings, PdfItemType } from './pdfItem';

type ImageItemSettings = {
  src?: string;
  width?: number;
  height?: number;
} & PdfItemSettings;

export class ImageElement extends PdfItem {
  private _src = '';
  private _width = 100;
  private _height = 100;

  constructor(settings?: ImageItemSettings) {
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

  get settings(): ImageItemSettings {
    return {
      ...this.parentSettings,
      src: this.src,
      width: this.width,
    };
  }

  setImageSettings(settings: ImageItemSettings = {}) {
    settings.src !== undefined && (this.src = settings.src);
    settings.width !== undefined && (this.width = settings.width);
    settings.height !== undefined && (this.height = settings.height);
  }

  override clone(deep?: boolean): ImageElement {
    const clone = Object.assign(new ImageElement(), {
      uId: uuid(),
    });
    if (deep) {
      Object.assign(clone, this.settings);
    }
    return clone;
  }
}
