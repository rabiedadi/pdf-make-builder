import {
  CdkDrag,
  CdkDragDrop,
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
import { PdfItemService } from '../../services/pdf-item.service';
import { DragDropService } from '../../services/drag-drop.service';
import { ContainerElement, PdfItem } from '../../models';

@Component({
  selector: 'app-pdf-container',
  templateUrl: './pdf-container.component.html',
  styleUrls: ['./pdf-container.component.scss'],
})
export class PdfContainerComponent implements OnInit, AfterViewInit {
  @ViewChild(CdkDropList) dropList?: CdkDropList;
  @Input({ required: true }) container!: ContainerElement;
  @Input() showOutline: boolean = true;
  focusedElement = this.pdfItemService.focusedElement$;

  allowDropPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    return this.container.isParent
      ? false
      : this.dragDropService.isDropAllowed(drag, drop);
  };

  public get connectedLists() {
    return this.dragDropService.dropLists;
  }

  constructor(
    public dragDropService: DragDropService,
    private pdfItemService: PdfItemService
  ) {}

  ngOnInit(): void {}

  get hasHeader() {
    return this.container.isParent && this.pdfItemService.hasHeader;
  }

  get hasFooter() {
    return this.container.isParent && this.pdfItemService.hasFooter;
  }

  ngAfterViewInit(): void {
    if (this.dropList) {
      this.dragDropService.register(this.dropList);
    }
  }
  dropped(event: CdkDragDrop<PdfItem[]>) {
    this.dragDropService.drop(event);
  }

  dragMoved(event: CdkDragMove<PdfItem>) {
    this.dragDropService.dragMoved(event);
  }

  dragReleased(event: CdkDragRelease) {
    this.dragDropService.dragReleased(event);
  }

  setFocusedElement(element: PdfItem) {
    this.pdfItemService.focusedElement$.next(element);
  }
}
