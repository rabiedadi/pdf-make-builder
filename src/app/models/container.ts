import { uuid } from '../helpers';
import { PdfItem, PdfItemSettings, PdfItemType } from './pdfItem';

export type ContainerItemSettings = {
  color?: string;
  bgColor?: string;
  alignment?: 'left' | 'center' | 'right';
} & PdfItemSettings;

export class ContainerElement extends PdfItem {
  public elements: PdfItem[] = [];
  private _color: string | undefined;
  private _bgColor: string | undefined;
  private _alignment: 'left' | 'center' | 'right' | undefined;
  isParent: boolean | undefined;

  constructor(settings?: ContainerItemSettings) {
    super(PdfItemType.CONTAINER, settings ?? { pt: 0, pb: 0, pr: 0, pl: 0 });
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

  get alignment() {
    return this._alignment;
  }
  set alignment(alignment: ContainerItemSettings['alignment']) {
    this._alignment = alignment;
    this.changed$.next();
  }

  get settings(): ContainerItemSettings {
    return {
      ...this.parentSettings,
      color: this.color,
      bgColor: this.bgColor,
      alignment: this.alignment,
    };
  }

  setContainerSettings(settings: ContainerItemSettings = {}) {
    settings.color !== undefined && (this._color = settings.color);
    settings.bgColor !== undefined && (this._bgColor = settings.bgColor);
    settings.alignment !== undefined && (this._alignment = settings.alignment);
  }

  override clone(deep?: boolean): ContainerElement {
    const clone = Object.assign<ContainerElement, Partial<ContainerElement>>(
      new ContainerElement(),
      {
        uId: uuid(),
      }
    );
    if (deep) {
      Object.assign<ContainerElement, Partial<ContainerElement>>(clone, {
        ...this.settings,
        elements: this.elements.map((e) => e.clone(true)),
      });
    }
    return clone;
  }
}
