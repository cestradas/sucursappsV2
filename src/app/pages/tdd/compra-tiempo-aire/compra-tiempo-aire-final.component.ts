import { Component, OnInit } from '@angular/core';
import { ResponseWS } from '../../../services/response/response.service';

@Component({ 
  selector: 'app-compra-tiempo-aire-final',
  templateUrl: './compra-tiempo-aire-final.component.html'
})
export class CompraTiempoAireFinalComponent implements OnInit {
  
  detallePago: any = {
    referenciaNumerica: '',
    fechaOperacion: '',
    cuentaOrdenante: '',
    telefono: '',
    importe: '',
    operadorTelefono: '',
    hora: ''
};
  constructor(private service: ResponseWS) { }

  ngOnInit() {
      // ESTILOS Preferente
      let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
      let btnContinuar = document.getElementById("terminar");
  
      if (storageTipoClienteTar === "true") {
  
        btnContinuar.classList.remove("color-botones");
        btnContinuar.classList.add("color-botones_Preferente");
      }
    const this_aux = this;
    const respPago = this_aux.service.detalleConfirmacionCTA;
    const respPagoJson = JSON.parse(respPago);
    console.log(respPagoJson);

    this_aux.detallePago.referenciaNumerica = respPagoJson.NumReferencia;
    
    this_aux.detallePago.fechaOperacion  = this.convertDate(respPagoJson.FechaHoraOperacion);
    // this_aux.detallePago.cuentaOrdenante = this_aux.service.numCuentaCTASel;
    this_aux.detallePago.telefono = respPagoJson.NumeroTelefono;
    this_aux.detallePago.importe = respPagoJson.ImporteCompra;
    this_aux.detallePago.operadorTelefono = this.service.operadorTelefono;
    this_aux.detallePago.hora  = this.convertTime(respPagoJson.FechaHoraOperacion);
  }

  convertDate (fecha) {
  const this_aux = this;
    const d = new Date(fecha);
    const date = d.getFullYear()  + '-' + d.getMonth() + '-' + d.getDate();
    console.log(date);
    return date;
  }

  convertTime (hora) {
    const d = new Date(hora);
    const time = d.getHours() + ':' + d.getMinutes() + ':' + d.getMilliseconds();
    return time;
  }

}
