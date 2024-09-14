import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { TextElement } from '../../models';
import { PdfItemComponentBase } from '../pdf-item-component-base.class';

@Component({
  selector: 'app-pdf-text',
  templateUrl: './pdf-text.component.html',
  styleUrls: ['./pdf-text.component.scss'],
})
export class PdfTextComponent
  extends PdfItemComponentBase<TextElement>
  implements AfterViewInit, AfterViewChecked
{
  @ViewChild('editable') editable!: ElementRef<HTMLDivElement>;
  lastContent = '';

  constructor() {
    super();
  }

  ngAfterViewChecked(): void {
    if (this.control.content !== this.lastContent) {
      this.lastContent = this.control.content;
      this.setCursorToEnd();
    }
  }

  ngAfterViewInit(): void {
    // the focus get removed by the cdk drag drop
    // I added this as a fix
    const element = this.editable.nativeElement;
    element.addEventListener('focus', () => this.setCursorToEnd());
    element.addEventListener('click', () => element.focus());
  }

  onInput(event: Event) {
    const content = (event.target as HTMLDivElement).innerText;
    this.control.content = content;
  }

  setCursorToEnd() {
    const element = this.editable.nativeElement;
    if (window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      range.collapse(false); // Move the cursor to the end of the content
      selection!.removeAllRanges();
      selection!.addRange(range);
    }
  }
}
