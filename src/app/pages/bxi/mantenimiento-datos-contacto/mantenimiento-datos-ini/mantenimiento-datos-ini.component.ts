import { ElementRef } from '@angular/core';
import { SesionBxiService } from './../../sesion-bxi.service';
import { OperacionesBXI } from './../../operacionesBXI';
import { Component, OnInit, ViewChild } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-mantenimiento-datos-ini',
  templateUrl: './mantenimiento-datos-ini.component.html',
  styleUrls: ['./mantenimiento-datos-ini.component.css']
})
export class MantenimientoDatosIniComponent implements OnInit {
  @ViewChild('correoElectronico', { read: ElementRef}) correoElectronico: ElementRef ;
  @ViewChild('numeroCelular', { read: ElementRef}) numeroCelular: ElementRef ;

  constructor(private service: SesionBxiService) { }

  ngOnInit() {
    const this_aux = this;
    /*this.getDatosContacto();*/
    this_aux.correoElectronico.nativeElement.value  = 'ricardofm.ipn@gmail.com';
    this_aux.numeroCelular.nativeElement.value = '7351108323';
  }

  getDatosContacto() {
    console.log('getDatosContacto');
    const this_aux = this;
    const operaciones: OperacionesBXI = new OperacionesBXI();
    operaciones.consultaDatosContacto(this_aux.service.infoUsuarioSIC).then(
      function(data) {
        const jsonData = data.responseJSON;
        if (jsonData.Id === '1') {
            if (jsonData.Email !== undefined) {
              this_aux.correoElectronico.nativeElement.value  = jsonData.Email;
            } else   if (jsonData.Telefono !== undefined ) {
              this_aux.numeroCelular.nativeElement.value = jsonData.Telefono;
            } 
        } else {
                  this_aux.showErrorSucces(jsonData);
        }
      }, function (error) { this_aux.showErrorPromise(error);   }
    );
  }


  editarCorreo(correoHTML) {
        
  }
  editarNumCel(numCelHTML) {

  }

  showErrorPromise(error) {
    console.log(error);
    // tslint:disable-next-line:max-line-length
    document.getElementById('mnsError').innerHTML =   "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde."; 
    $('#_modal_please_wait').modal('hide');
    $('#errorModal').modal('show');
  }

  showErrorSucces(json) {
    console.log(json.Id + json.MensajeAUsuario);
    document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario; 
    $('#_modal_please_wait').modal('hide');
    $('#errorModal').modal('show');
  }


}
