import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { PdfItemService } from './services/pdf-item.service';
import { PdfMakeBuilderService } from './services/pdfmake-builder.service';
import { Clipboard } from '@angular/cdk/clipboard';

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
    private clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    this.pdfItemService.init();
    this.cdr.detectChanges();
  }

  build() {
    this.pdfMakeBuilderService
      .build(this.parentContainer$.value!)
      .then((dd) => {
        this.docDef = JSON.stringify(dd, undefined, '\t');
        this.clipboard.copy(this.docDef);
        console.log('done');
      });
  }
}
