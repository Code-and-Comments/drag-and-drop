import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[testDirective]',
  standalone: true,
})
export class TestDirective {
  @HostBinding('class.fileover') fileOver = false;

  @HostListener('mouseenter', ['$event']) private onMouseEnter(evt: any) {
    this.fileOver = true;
  }

  @HostListener('mouseleave', ['$event']) private onMouseLeave(evt: any) {
    this.fileOver = false;
  }

  public logSmth() {
    console.log('Muchael')
  }
}