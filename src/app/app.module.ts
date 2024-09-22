import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { PdfRowsComponent } from './components/pdf-row/pdf-row.component';
import { PdfContainerComponent } from './components/pdf-container/pdf-container.component';
import { PdfImageComponent } from './components/pdf-image/pdf-image.component';
import { PdfTextComponent } from './components/pdf-text/pdf-text.component';
import { DraggingDirective } from './dragging.directive';
import { NewElementsComponent } from './components/new-elements/new-elements.component';
import { PdfItemStyleApplier } from './directives/pdf-item-style-applier.directive';
import { ElementSettingsComponent } from './components/element-settings/element-settings.component';
import { FormsModule } from '@angular/forms';
import { PdfCheckComponent } from './components/pdf-check/pdf-check.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PageSettingsComponent } from './components/page-settings/page-settings.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { PdfLineComponent } from './components/pdf-line/pdf-line.component';

@NgModule({
  declarations: [
    AppComponent,
    NewElementsComponent,
    DraggingDirective,
    PdfContainerComponent,
    PdfRowsComponent,
    PdfTextComponent,
    PdfCheckComponent,
    PdfImageComponent,
    PdfItemStyleApplier,
    PdfLineComponent,
    ElementSettingsComponent,
    PageSettingsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatIconModule,
    DragDropModule,
    MatTabsModule,
    MatIconModule,
    ClipboardModule,
    BrowserAnimationsModule,
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
