import { Component, OnInit } from '@angular/core';
import { SesionBxiService } from '../../sesion-bxi.service';

@Component({
  selector: 'app-cancelar-envio-edc-finish',
  templateUrl: './cancelar-envio-edc-finish.component.html'
})
export class CancelarEnvioEdcFinishComponent implements OnInit {

  constructor(private service: SesionBxiService) { }

  correoRegistrado: string;
  ngOnInit() {
    this.correoRegistrado = this.service.EmailCliente;

    //ESTILOS Preferente
    let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
    let btnTerminar = document.getElementById("terminar");

    if (storageTipoClienteBEL === "true") {

      btnTerminar.classList.remove("color-botones");
      btnTerminar.classList.add("color-botones_Preferente");


    }
  }

}
