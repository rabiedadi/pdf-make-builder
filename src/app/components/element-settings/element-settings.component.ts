import { Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { pdfTree } from '../../models';
import { PdfItemService } from '../../services/pdf-item.service';

@Component({
  selector: 'app-element-settings',
  templateUrl: './element-settings.component.html',
  styleUrls: ['./element-settings.component.scss'],
})
export class ElementSettingsComponent implements OnInit, OnDestroy {
  selectedElement: pdfTree.PdfItem | undefined;
  selectedContainer: pdfTree.ContainerElement | undefined;
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

  getElementRecursive(element: pdfTree.PdfItem, uId: string) {
    if (element.uId === uId) {
      this.selectedElement = element;
      this.selectedContainer = undefined;
      return;
    }
    if (element.type === pdfTree.PdfItemType.ROW) {
      (element as pdfTree.RowElement).columns.forEach((col) => {
        this.getElementRecursive(col, uId);
      });
    }
    if (element.type === pdfTree.PdfItemType.CONTAINER) {
      (element as pdfTree.ContainerElement).elements.forEach((ele) => {
        this.getElementRecursive(ele, uId);
      });
    }
  }

  delElement(uId: string) {
    this.delElementRecursive(this.pdfItemService.parentContainer$.value!, uId);
  }

  delElementRecursive(element: pdfTree.PdfItem, uId: string) {
    if (element.type === pdfTree.PdfItemType.ROW) {
      const index = (element as pdfTree.RowElement).columns.findIndex(
        (c) => c.uId === uId
      );
      if (index > -1) {
        (element as pdfTree.RowElement).cols.splice(index, 1);
        (element as pdfTree.RowElement).columns.splice(index, 1);
        this.selectedContainer = undefined;
      } else {
        (element as pdfTree.RowElement).columns.forEach((col) => {
          this.delElementRecursive(col, uId);
        });
      }
    }
    if (element.type === pdfTree.PdfItemType.CONTAINER) {
      const index = (element as pdfTree.ContainerElement).elements.findIndex(
        (c) => c.uId === uId
      );
      if (index > -1) {
        (element as pdfTree.ContainerElement).elements.splice(index, 1);
        this.selectedElement = undefined;
        this.selectedContainer = undefined;
      } else {
        (element as pdfTree.ContainerElement).elements.forEach((col) => {
          this.delElementRecursive(col, uId);
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
