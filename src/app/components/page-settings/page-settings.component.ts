import { Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { pdfTree } from '../../models';
import { PdfItemService } from '../../services/pdf-item.service';

@Component({
  selector: 'app-page-settings',
  templateUrl: './page-settings.component.html',
  styleUrls: ['./page-settings.component.scss'],
})
export class PageSettingsComponent implements OnInit, OnDestroy {
  parentContainer$ = this.pdfItemService.parentContainer$;

  constructor(public pdfItemService: PdfItemService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
