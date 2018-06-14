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
  }

}
