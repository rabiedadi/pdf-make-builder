import { Injectable } from '@angular/core';
import { PdfTreeBuilderService } from './pdfTree-builder.service';
import { HistoryItem } from '../models/history';
import { PdfItemService } from './pdf-item.service';
import { ContainerElement } from '../models';

const PDFHISTORY = 'pdfHistory';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private history: HistoryItem[] = [];
  private currentIndex: number = -1;

  constructor(
    private pdfTreeBuilderService: PdfTreeBuilderService,
    private pdfItemService: PdfItemService
  ) {
    this.init();
  }

  init() {
    this.history = this.LocalHistoryItems;
    this.history.length && this.build(this.history[this.history.length - 1]);
  }

  get root() {
    return this.pdfItemService.parentContainer$.value;
  }

  // Save a new state to history
  save(): void {
    if (!this.root) return;
    const state = this.pdfTreeBuilderService.createHistoryFromItem(this.root);
    // If current index is not the last, remove future states
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }
    this.history.push(state);
    this.LocalHistoryItems = this.history;
    this.currentIndex++;
  }

  // Import a predefined history
  import(history: HistoryItem[]): void {
    if (!history.length) return;
    this.history = history;
    this.currentIndex = history.length - 1; // Start at the last item
    this.build();
  }

  // Move back in history
  back() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.build();
    }
  }

  // Move forward in history
  forward() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      this.build();
    }
  }

  // Get current state
  get current(): HistoryItem {
    return this.history[this.currentIndex];
  }

  build(item?: HistoryItem) {
    const historyItem = item ?? this.current;
    if (!historyItem) return;
    const pdfItem =
      this.pdfTreeBuilderService.reconstructItemFromHistory(historyItem);
    this.pdfItemService.parentContainer$.next(pdfItem as ContainerElement);
  }

  get LocalHistoryItems() {
    return JSON.parse(localStorage.getItem(PDFHISTORY) ?? '[]');
  }

  set LocalHistoryItems(items: HistoryItem[]) {
    localStorage.setItem(PDFHISTORY, JSON.stringify(items));
  }
}
