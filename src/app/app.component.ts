import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PdfItemService } from './services/pdf-item.service';
import { PdfBuilderService } from './services/pdf-builder.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PdfMakeBuilderService } from './services/pdfmake-builder.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  parentContainer$ = this.pdfItemService.parentContainer$;
  pdf: SafeHtml = '';
  constructor(
    private pdfItemService: PdfItemService,
    private cdr: ChangeDetectorRef,
    private pdfMakeBuilderService: PdfMakeBuilderService,
    private pdfBuilderService: PdfBuilderService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.pdfItemService.init();
    this.cdr.detectChanges();
    setTimeout(() => {
      this.parentContainer$.value!.bgColor = '#ff0000';
    }, 5000);
  }

  build() {
    this.pdf = this.sanitizer.bypassSecurityTrustHtml(
      this.pdfBuilderService.build(this.parentContainer$.value!)
    );
    this.pdfMakeBuilderService
      .build(this.parentContainer$.value!)
      .then(console.log);
  }
}
