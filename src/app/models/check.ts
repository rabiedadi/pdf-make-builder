import { uuid } from '../helpers';
import { PdfItem, PdfItemSettings, PdfItemType } from './pdfItem';

type CheckItemSettings = {} & PdfItemSettings;

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

  get settings(): CheckItemSettings {
    return {
      ...this.parentSettings,
    };
  }
  override clone(deep?: boolean): CheckElement {
    const clone = Object.assign(new CheckElement(), {
      uId: uuid(),
    });
    if (deep) {
      Object.assign(clone, {
        ...this.settings,
        value: this.value,
        content: this.content,
      });
    }
    return clone;
  }
}
