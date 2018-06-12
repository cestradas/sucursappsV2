import { Component, OnInit } from '@angular/core';

@Component ( {
  selector: 'app-operacion-exitosa',
  templateUrl: './operacion-exitosa.component.html',
})
export class OperacionExitosaComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    //ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnContinuar = document.getElementById("aceptar");

    if (storageTipoClienteTar === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }
  }

}
