import { Component, OnDestroy, OnInit } from '@angular/core';
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
})
export class ElementSettingsComponent implements OnInit, OnDestroy {
  selectedElement: PdfItem | undefined;
  selectedContainer: ContainerElement | undefined;
  subscription: Subscription | undefined;

  constructor(private pdfItemService: PdfItemService) {}

  ngOnInit(): void {
    this.subscription = this.pdfItemService.focusedElement$.subscribe(
      async (el) => {
        if (el) {
          const parentContainer = await firstValueFrom(
            this.pdfItemService.parentContainer$
          );
          this.getElementRecursive(parentContainer!, el.uId);
        }
      }
    );
  }

  getElementRecursive(element: PdfItem, uId: string) {
    if (element.uId === uId) {
      this.selectedElement = element;
      this.selectedContainer = undefined;
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
    if (element.type === PdfItemType.ROW) {
      const index = (element as RowElement).columns.findIndex(
        (c) => c.uId === uId
      );
      if (index > -1) {
        (element as RowElement).cols.splice(index, 1);
        (element as RowElement).columns.splice(index, 1);
        this.selectedContainer = undefined;
      } else {
        (element as RowElement).columns.forEach((col) => {
          this.delElementRecursive(col, uId);
        });
      }
    }
    if (element.type === PdfItemType.CONTAINER) {
      const index = (element as ContainerElement).elements.findIndex(
        (c) => c.uId === uId
      );
      if (index > -1) {
        (element as ContainerElement).elements.splice(index, 1);
        this.selectedElement = undefined;
        this.selectedContainer = undefined;
      } else {
        (element as ContainerElement).elements.forEach((col) => {
          this.delElementRecursive(col, uId);
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
