import {
  CdkDragExit,
  CdkDragMove,
  CdkDragRelease,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DragDropService } from '../../services/drag-drop.service';
import { PdfItemService } from '../../services/pdf-item.service';
import { pdfTree } from '../../models';

@Component({
  selector: 'app-new-elements',
  templateUrl: './new-elements.component.html',
  styleUrls: ['./new-elements.component.scss'],
})
export class NewElementsComponent implements OnInit, AfterViewInit {
  @ViewChild(CdkDropList) dropList?: CdkDropList;
  @Input() type: 'components' | 'rows' = 'components';

  public items: pdfTree.dragPdfItem[] = [];
  public get connectedLists() {
    return this.dragDropService.dropLists;
  }
  constructor(
    private pdfItemService: PdfItemService,
    public dragDropService: DragDropService
  ) {}

  ngOnInit(): void {
    if (this.type == 'components') {
      for (const [type, Item] of Object.entries(this.pdfItemService.pdfItems)) {
        ![pdfTree.PdfItemType.CONTAINER, pdfTree.PdfItemType.ROW].includes(
          type as pdfTree.PdfItemType
        ) && this.items.push(new Item());
      }
    }
    if (this.type == 'rows') {
      this.items.push(new pdfTree.RowElement([12]));
      this.items.push(new pdfTree.RowElement([3, 9]));
      this.items.push(new pdfTree.RowElement([4, 8]));
      this.items.push(new pdfTree.RowElement([6, 6]));
      this.items.push(new pdfTree.RowElement([9, 3]));
      this.items.push(new pdfTree.RowElement([4, 4, 4]));
      this.items.push(new pdfTree.RowElement([4, 6, 2]));
      this.items.push(new pdfTree.RowElement([3, 3, 3, 3]));
      this.items.push(new pdfTree.RowElement([2, 2, 2, 2, 2, 2]));
    }
  }

  ngAfterViewInit(): void {
    if (this.dropList) {
      this.dragDropService.register(this.dropList);
    }
  }

  disallowDropPredicate() {
    return false;
  }

  dropListExited(event: CdkDragExit<any>) {
    this.createItemClone(event);
  }

  dropListEntered() {
    this.removeItemClone();
  }

  dragMoved(event: CdkDragMove<pdfTree.PdfItem>) {
    this.dragDropService.dragMoved(event);
  }

  dragReleased(event: CdkDragRelease) {
    this.dragDropService.dragReleased(event);

    this.removeItemClone();
  }

  createItemClone(event: CdkDragExit<any>) {
    this.items.splice(
      event.container._dropListRef.getItemIndex(event.item._dragRef) + 1,
      0,
      {
        ...event.item.data,
        isClone: true,
      }
    );
  }

  removeItemClone() {
    this.items = this.items.filter((i) => !i.isClone);
  }
}
