import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    let terminal = localStorage.getItem("terminal");

    document.getElementById('terminal').innerHTML = terminal;
  }

}
