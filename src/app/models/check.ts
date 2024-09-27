import { uuid } from '../helpers';
import { PdfItem, PdfItemSettings, PdfItemType } from './pdfItem';

export type CheckItemSettings = {
  preview?: string;
  label?: string;
  value?: string;
  fontSize?: number;
} & PdfItemSettings;

export class CheckElement extends PdfItem {
  preview = '';
  label = '';
  value = '';
  private _fontSize: number | undefined;

  constructor(settings?: CheckItemSettings) {
    super(PdfItemType.CHECK, settings);
    this.setCheckSettings(settings);
  }

  get fontSize() {
    return this._fontSize;
  }
  set fontSize(v: number | undefined) {
    this._fontSize = v;
    this.changed$.next();
  }

  get settings(): CheckItemSettings {
    return {
      ...this.parentSettings,
      preview: this.preview,
      label: this.label,
      value: this.value,
      fontSize: this.fontSize,
    };
  }

  setCheckSettings(settings: CheckItemSettings = {}) {
    this.preview = settings.preview ?? '';
    this.label = settings.label ?? '';
    this.value = settings.value ?? '';
    this.fontSize = settings.fontSize;
  }

  override clone(deep?: boolean): CheckElement {
    const clone = Object.assign(new CheckElement(), {
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
