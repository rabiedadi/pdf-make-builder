import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HistoryService } from './services/history.service';
import { PdfItemService } from './services/pdf-item.service';
import { PdfMakeBuilderService } from './services/pdfmake-builder.service';
import { PdfTreeBuilderService } from './services/pdfTree-builder.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  parentContainer$ = this.pdfItemService.parentContainer$;
  docDef = '';
  constructor(
    private pdfItemService: PdfItemService,
    private cdr: ChangeDetectorRef,
    private pdfMakeBuilderService: PdfMakeBuilderService,
    private historyService: HistoryService,
    private clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    !this.historyService.LocalHistoryItems.length && this.pdfItemService.init();
    this.cdr.detectChanges();
  }

  construct() {
    const root = this.parentContainer$.value!;
    this.pdfMakeBuilderService.build(root).then((docDef) => {
      this.docDef = JSON.stringify(docDef, undefined, '\t');
      this.clipboard.copy(this.docDef);
    });
  }

  build() {
    const root = this.parentContainer$.value!;
    this.pdfMakeBuilderService.build(root, true).then((docDef) => {
      this.docDef = JSON.stringify(docDef, undefined, '\t');
      this.clipboard.copy(this.docDef);
    });
  }

  save() {
    this.historyService.save();
  }

  back() {
    this.historyService.back();
  }

  forward() {
    this.historyService.forward();
  }
}
