import { uuid } from '../helpers';
import { PdfItem, PdfItemSettings, PdfItemType } from './pdfItem';

type ImageItemSettings = {
  src?: string;
  width?: number;
};

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

  override clone(): ImageElement {
    return Object.assign(new ImageElement(), {
      uId: uuid(),
    });
  }
}
