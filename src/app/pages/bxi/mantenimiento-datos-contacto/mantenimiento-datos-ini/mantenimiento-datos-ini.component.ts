import { ElementRef } from '@angular/core';
import { SesionBxiService } from './../../sesion-bxi.service';
import { OperacionesBXI } from './../../operacionesBXI';
import { Component, OnInit, ViewChild } from '@angular/core';


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
    
    this.getDatosContacto();
  }

  getDatosContacto() {
    const this_aux = this;
    const operaciones: OperacionesBXI = new OperacionesBXI();
    operaciones.consultaDatosContacto(this_aux.service.infoUsuarioSIC).then(
      function(data) {
        const jsonData = data.responseJSON;
        if (jsonData.Id === '1') {

           this_aux.correoElectronico.nativeElement.value  = jsonData.Email;
           this_aux.numeroCelular.nativeElement.value = jsonData.Telefono;

        } else {

        }
      }, function (error) {

      }
    );
  }

}
