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

    //ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnContinuar = document.getElementById("aceptar");
    let btnSalir = document.getElementById("salir");

    if (storageTipoClienteTar === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
      btnSalir.classList.remove("color-botones");
      btnSalir.classList.add("color-botones_Preferente");
    }


  }
  confirmacion () {
    const div = document.getElementById('servicioNoDisponible');
    $('#servicioNoDisponible').modal('show');


  }
}
