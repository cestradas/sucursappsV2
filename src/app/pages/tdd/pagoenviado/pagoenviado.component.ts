import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagoenviado',
  templateUrl: './pagoenviado.component.html',
})
export class PagoenviadoComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    //ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnContinuar = document.getElementById("terminar");

    if (storageTipoClienteTar === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }


  }

}
