import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { PdfItemService } from '../../services/pdf-item.service';
import {
  PdfItem,
  ContainerElement,
  PdfItemType,
  RowElement,
} from '../../models';

@Component({
  selector: 'app-element-settings',
  templateUrl: './element-settings.component.html',
  styleUrls: ['./element-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementSettingsComponent implements OnInit, OnDestroy {
  selectedElement = signal<PdfItem | undefined>(undefined);
  selectedContainer = signal<ContainerElement | undefined>(undefined);
  subscription: Subscription | undefined;

  constructor(private pdfItemService: PdfItemService) {}

  ngOnInit(): void {
    this.subscription = this.pdfItemService.focusedElement$.subscribe(
      async (el) => {
        if (el) {
          const root = this.pdfItemService.parentContainer$.value!;
          this.getElementRecursive(root, el.uId);
        }
      }
    );
  }

  getElementRecursive(element: PdfItem, uId: string) {
    if (element.uId === uId) {
      this.selectedElement.set(element);
      this.selectedContainer.set(undefined);
      return;
    }
    if (element.type === PdfItemType.ROW) {
      (element as RowElement).columns.forEach((col) => {
        this.getElementRecursive(col, uId);
      });
    }
    if (element.type === PdfItemType.CONTAINER) {
      (element as ContainerElement).elements.forEach((ele) => {
        this.getElementRecursive(ele, uId);
      });
    }
  }

  delElement(uId: string) {
    this.delElementRecursive(this.pdfItemService.parentContainer$.value!, uId);
  }

  delElementRecursive(element: PdfItem, uId: string) {
    if (this.isRowElement(element)) {
      const index = element.columns.findIndex((c) => c.uId === uId);
      if (index > -1) {
        element.cols.splice(index, 1);
        element.columns.splice(index, 1);
        this.selectedContainer.set(undefined);
      } else {
        element.columns.forEach((col) => {
          this.delElementRecursive(col, uId);
        });
      }
    }
    if (this.isContainerElement(element)) {
      const index = element.elements.findIndex((c) => c.uId === uId);
      if (index > -1) {
        if (element.isParent) {
          return;
        }
        element.elements.splice(index, 1);
        this.selectedElement.set(undefined);
        this.selectedContainer.set(undefined);
      } else {
        element.elements.forEach((col) => {
          this.delElementRecursive(col, uId);
        });
      }
    }
  }

  cloneElement(uId: string) {
    this.cloneElementRecursive(
      this.pdfItemService.parentContainer$.value!,
      uId
    );
  }

  cloneElementRecursive(element: PdfItem, uId: string) {
    if (this.isRowElement(element)) {
      const index = element.columns.findIndex((c) => c.uId === uId);
      if (index > -1) {
        const clone = element.columns[index].clone(true);
        element.cols.splice(index, 0, element.cols[index]);
        element.columns.splice(index, 0, clone);
      } else {
        element.columns.forEach((col) => {
          this.cloneElementRecursive(col, uId);
        });
      }
    }
    if (this.isContainerElement(element)) {
      const index = element.elements.findIndex((c) => c.uId === uId);
      if (index > -1) {
        if (element.isParent) {
          return;
        }
        const clone = element.elements[index].clone(true);
        element.elements.splice(index, 0, clone);
      } else {
        element.elements.forEach((col) => {
          this.cloneElementRecursive(col, uId);
        });
      }
    }
  }

  isRowElement(element: PdfItem): element is RowElement {
    return element.type === PdfItemType.ROW;
  }

  isContainerElement(element: PdfItem): element is ContainerElement {
    return element.type === PdfItemType.CONTAINER;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
