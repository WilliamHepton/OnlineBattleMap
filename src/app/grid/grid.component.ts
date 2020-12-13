import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridsterItemComponentInterface, GridType } from 'angular-gridster2';
import {CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { BattleImage } from '../entities/battle-image';
import { GridItem, GridItemContent } from '../entities/grid-item';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class GridComponent implements OnInit, OnChanges {
  @ViewChild('grid', {static: false}) gridDiv: ElementRef;
  @Input() backgroundRAW: string;

  options: GridsterConfig;
  battleGrid: Array<GridItemContent>;
  backgroundURL: string = "url(https://i.pinimg.com/originals/1e/94/a7/1e94a7d9d18a0ee861a5a64f6d974e7c.jpg)";
  
  newImageDrop: BattleImage = {name: "", url: ""};
  test: string[] = [];

  constructor(private renderer: Renderer2, private cd: ChangeDetectorRef) { }

  ngOnChanges(): void {
    this.backgroundURL = "url(" + this.backgroundRAW + ")";
  }

  ngOnInit() {
    this.options = {
      gridType: GridType.Fixed,
      compactType: CompactType.None,
      margin: 0,
      outerMargin: false,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      mobileBreakpoint: 640,
      minCols: 55,
      maxCols: 1000,
      minRows: 55,
      maxRows: 1000,
      maxItemCols: 100,
      minItemCols: 1,
      maxItemRows: 100,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 2,
      fixedColWidth: 55,
      fixedRowHeight: 55,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      enableOccupiedCellDrop: false,
      emptyCellDragMaxCols: 100,
      emptyCellDragMaxRows: 100,
      ignoreMarginInRow: false,
      draggable: {
        enabled: true,
        dropOverItems: true,
      },
      resizable: {
        enabled: true,
      },
      swap: false,
      pushItems: false,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: {north: true, east: true, south: true, west: true},
      pushResizeItems: false,
      displayGrid: DisplayGrid.Always,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false
    };

    this.battleGrid = [
      {id: 1, battleImage: {name: "Aurora", url: ""}, cols: 1, rows: 2, y: 10, x: 5},
      {id: 2, battleImage: {name: "Alavar", url: ""}, cols: 1, rows: 2, y: 10, x: 10},
      {id: 3, battleImage: {name: "Mob", url: ""}, cols: 2, rows: 2, y: 5, x: 7}
    ];
  }

  ngAfterViewInit() {
  }

  changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
    this.backgroundURL = "url(" + this.backgroundRAW + ")";
  }

  removeItem($event: MouseEvent | TouchEvent, item): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.battleGrid.splice(this.battleGrid.indexOf(item), 1);
  }

  addItem(): void {
    this.battleGrid.push({id: this.newItemId(), battleImage: {name: "", url: ""}, cols: 2, rows: 2, y: 0, x: 0});
  }

  newItemId(): number {
    return this.battleGrid[this.battleGrid.length-1].id + 1;
  }

  drop(event: CdkDragDrop<string[]>) {
    copyArrayItem(event.previousContainer.data,
                      this.test,
                      event.previousIndex,
                      event.currentIndex);
    this.newImageDrop = JSON.parse(JSON.stringify(this.test[0]));
    this.newImageDrop.url = "url(" + this.newImageDrop.url + ")";
    console.log(this.newImageDrop);
    event.container.element.nativeElement.style.setProperty("background-image", this.newImageDrop.url.toString());
  }
}
