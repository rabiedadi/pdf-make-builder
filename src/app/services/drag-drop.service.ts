import {
  CdkDrag,
  CdkDragDrop,
  CdkDragMove,
  CdkDragRelease,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PdfItemService } from './pdf-item.service';
import { PdfItem } from '../models';

@Injectable({ providedIn: 'root' })
export class DragDropService {
  dropLists: CdkDropList[] = [];
  currentHoverDropListId?: string;
  controlDropped: Subject<PdfItem> = new Subject<PdfItem>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private pdfItemService: PdfItemService
  ) {}

  public register(dropList: CdkDropList) {
    this.dropLists.push(dropList);
  }

  dragMoved(event: CdkDragMove<PdfItem>) {
    let elementFromPoint = this.document.elementFromPoint(
      event.pointerPosition.x,
      event.pointerPosition.y
    );

    if (!elementFromPoint) {
      this.currentHoverDropListId = undefined;
      return;
    }

    if (elementFromPoint.classList.contains('no-drop')) {
      this.currentHoverDropListId = 'no-drop';
      return;
    }

    let dropList = elementFromPoint.classList.contains('cdk-drop-list')
      ? elementFromPoint
      : elementFromPoint.closest('.cdk-drop-list');

    if (!dropList) {
      this.currentHoverDropListId = undefined;
      return;
    }

    this.currentHoverDropListId = dropList.id;
  }

  isDropAllowed(drag: CdkDrag, drop: CdkDropList) {
    if (this.currentHoverDropListId == null) {
      return true;
    }

    return drop.id === this.currentHoverDropListId;
  }

  drop(event: CdkDragDrop<PdfItem[]>) {
    if (event.previousContainer.id !== 'toolbox') {
      if (event.previousContainer == event.container) {
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }

      this.controlDropped.next(event.item.data);
    } else {
      let sourceElement = <PdfItem>event.item.data;
      let element = sourceElement.clone();

      event.container.data.splice(event.currentIndex, 0, element);

      this.controlDropped.next(element);

      if (!this.pdfItemService.focusedElement$.value) {
        this.pdfItemService.focusedElement$.next(element);
      }
    }
  }

  dragReleased(event: CdkDragRelease) {
    this.currentHoverDropListId = undefined;
  }
}
