import { Directive, ElementRef, Inject, AfterViewInit, Renderer2, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { DNDClassSettings, DND_SETTINGS } from './dnd.provider';

@Directive({
  selector: '[appSelectable]'
})
export class SelectableDirective implements AfterViewInit {

  @Input() selectId: string;
  @Input() disableSelectMode = false;
  @Output() selectionChanged = new EventEmitter<SelectionInfo>();

  lastHoverClass = 'lastHoverClass';
  shiftIsDown = false;
  isHovered = false;

  constructor(
    @Inject(DND_SETTINGS) public dndSettings: DNDClassSettings,
    private elRef: ElementRef,
    private renderer: Renderer2,
  ) { }

  get isSelected(): boolean {
    return this.elRef.nativeElement.classList.contains(this.dndSettings.selectClass);
  }

  get isInSelectMode(): boolean {
    return this.elRef.nativeElement.classList.contains(this.dndSettings.selectModeClass);
  }

  get siblings(): HTMLElement[] {
    const siblings = Array.from(this.elRef.nativeElement.parentNode.children) as HTMLElement[];
    return siblings.filter(el => !el.classList.contains(this.dndSettings.selectExceptClass));
  }

  @HostListener('click') onclick() {
    if (this.isInSelectMode && !this.disableSelectMode) {
      if (this.shiftIsDown) {
        this.shiftClick();
      } else {
        this.toggleSelectClass();
      }
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.isHovered = false;
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.isHovered = true;
    this.declareLastHovered();
    if (this.isInSelectMode && this.shiftIsDown) {
      this.evaluateShiftSelect();
    }
  }

  @HostListener('document:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if ((event.key === 'Escape' || event.key === 'Esc') && !this.disableSelectMode) {
      this.removeSelect();
      return;
    }

    if (event.shiftKey && this.isInSelectMode) {
      this.shiftIsDown = true;
    }
    if (this.isHovered && event.shiftKey) {
      this.evaluateShiftSelect();
    }
  }

  @HostListener('document:keyup', ['$event']) onKeyUp(event: KeyboardEvent) {
    if (!event.shiftKey) {
      this.shiftIsDown = false;
      this.removeShiftSelect();
    }
  }

  ngAfterViewInit() {
    this.attachClickListenerForHandler();
  }

  // attach click listener via an ID to start the select mode
  attachClickListenerForHandler() {
    const selectHandleClass = this.dndSettings.selectHandlerPrefix + '-' + this.selectId;
    const el = document.getElementById(selectHandleClass) as HTMLElement;

    this.renderer.listen(el, 'click', (event) => {
      event.stopPropagation();
      if (this.shiftIsDown && !this.disableSelectMode) {
        this.shiftClick();
      } else {
        this.toggleSelectClass();
      }
    });
  }

  removeShiftSelect() {
    for (const element of this.siblings) {
      element.classList.remove(this.dndSettings.selectShiftClass);
    }
  }

  evaluateShiftSelect() {
    const lastSelect = document.getElementsByClassName(this.dndSettings.selectLastClass)[0] as HTMLElement;
    const lastHover = document.getElementsByClassName(this.lastHoverClass)[0] as HTMLElement;

    // if one of the bounds is missing don't run shift select
    if (lastSelect == null || lastHover == null) {
      return;
    }

    // determine order of lastSelect or lastHover
    let directionLR = true;
    if (lastSelect.offsetTop === lastHover.offsetTop) {
      if (lastSelect.offsetLeft > lastHover.offsetLeft) {
        directionLR = false;
      }
    } else {
      directionLR = lastSelect.offsetTop < lastHover.offsetTop;
    }

    // determine last element that should be selected depending on direction
    const lastHoverDirClean = directionLR ? lastHover.nextSibling : lastHover;
    const lastSelectDirClean = directionLR ? lastSelect : lastSelect.nextSibling;

    let collect = false;
    for (const element of this.siblings) {
      if (element === lastSelectDirClean || element === lastHoverDirClean) {
        collect = !collect;
      }

      if (collect) {
        element.classList.add(this.dndSettings.selectShiftClass);
      } else {
        element.classList.remove(this.dndSettings.selectShiftClass);
      }
    }
  }

  shiftClick() {
    const elements = Array.from(document.getElementsByClassName(this.dndSettings.selectShiftClass));
    for (const el of elements) {
      el.classList.add(this.dndSettings.selectClass);
    }
    if (elements.length > 0) {
      this.selectionUpdate();
    }
    this.declareLastSelected();
  }

  declareLastHovered() {
    for (const element of this.siblings) {
      element.classList.remove(this.lastHoverClass);
    }
    this.elRef.nativeElement.classList.add(this.lastHoverClass);
  }

  toggleSelectClass() {
    this.elRef.nativeElement.classList.toggle(this.dndSettings.selectClass);
    this.selectionUpdate();
    this.declareLastSelected();
    this.refreshEditMode();
  }

  declareLastSelected() {
    // remove last class from all and set on current
    for (const element of this.siblings) {
      element.classList.remove(this.dndSettings.selectLastClass);
    }
    if (this.isSelected) {
      this.elRef.nativeElement.classList.add(this.dndSettings.selectLastClass);
    } else {
      this.elRef.nativeElement.classList.remove(this.dndSettings.selectLastClass);
    }
  }

  // when any item changes the selection, recheck if still in edit mode (if at least 1 item is still selected)
  refreshEditMode() {
    let stillActive = false;

    // check if any sibling is still selected
    for (const element of this.siblings) {
      if (element.classList.contains(this.dndSettings.selectClass)) {
        stillActive = true;
        continue;
      }
    }

    // add or remove selectMode if there was still an selected
    for (const element of this.siblings) {
      if (stillActive) {
        element.classList.add(this.dndSettings.selectModeClass);
      } else {
        element.classList.remove(this.dndSettings.selectModeClass);
      }
    }
  }

  removeSelect() {
    this.siblings.forEach(el =>
      el.classList.remove(
        this.dndSettings.selectClass, this.dndSettings.selectLastClass, this.dndSettings.selectModeClass
      )
    );
    this.selectionUpdate();
  }

  selectionUpdate() {
    const selectionInfo: SelectionInfo = {
      selectId: this.selectId,
      isSelected: this.elRef.nativeElement.classList.contains(this.dndSettings.selectClass),
    };
    this.selectionChanged.emit(selectionInfo);
  }
}

export interface SelectionInfo {
  selectId: string;
  isSelected: boolean;
}
