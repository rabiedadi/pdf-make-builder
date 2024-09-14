import { uuid } from '../helpers';
import { PdfItem, PdfItemSettings, PdfItemType } from './pdfItem';

type ContainerItemSettings = {
  color?: string;
  bgColor?: string;
  isParent?: string;
};

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

  override clone(): ContainerElement {
    const { elements, ...rest } = this;
    return Object.assign(new ContainerElement(), {
      ...rest,
      uId: uuid(),
    });
  }
}
