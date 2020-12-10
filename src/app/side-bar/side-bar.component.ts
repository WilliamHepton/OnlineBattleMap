import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  opened: boolean;
  constructor() { }

  ngOnInit() {
  }


}
