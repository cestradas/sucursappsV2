import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transfer-finish-spei',
  templateUrl: './transfer-finish-spei.component.html',
  styles: []
})
export class TransferFinishSpeiComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    //ESTILOS Preferente
    let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
    let btnContinuar = document.getElementById("terminar");

    if (storageTipoClienteBEL === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }
  }

}
