import { Component, OnInit } from '@angular/core';

import $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-activacion-exitosa',
  templateUrl: './activacion-exitosa.component.html'
})
export class ActivacionExitosaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    
  }
  confirmacion () {
    const div = document.getElementById('servicioNoDisponible');
    $('#servicioNoDisponible').modal('show');
    
  
  }
}
