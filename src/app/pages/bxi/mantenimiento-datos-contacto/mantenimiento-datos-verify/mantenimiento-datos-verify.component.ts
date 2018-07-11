import { SesionBxiService } from './../../sesion-bxi.service';
import { Component, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
declare var jquery: any; // jquery
declare var $: any;
@Component({
  selector: 'app-mantenimiento-datos-verify',
  templateUrl: './mantenimiento-datos-verify.component.html'
})
export class MantenimientoDatosVerifyComponent implements OnInit {

  NombreUser: string;
  Sic: string;
  Celular: string;
  CorreoElectronico: string;
  Fecha: string;
  Time: string;
  actCel = false; 
  actCorreo = false;

  constructor(private service: SesionBxiService, private router: Router) { }

  ngOnInit() {
    this.NombreUser = this.service.NombreUsuario;
    this.Sic = this.service.infoUsuarioSIC; 
    this.Fecha = this.service.Fecha;
    this.Time = this.service.Tiempo; 
    if (this.service.cambioCel) {
        this.actCel = true;
        this.Celular = this.service.CelCliente;
      } 
       if (this.service.cambioCorreo) {
        this.actCorreo = true;
        this.CorreoElectronico = this.service.EmailCliente;
      }      
  setTimeout(function() {
      $('#_modal_please_wait').modal('hide');
      $('div').removeClass('modal-backdrop');
    }, 500);

    // ESTILOS Preferente
    let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
    let btnContinuar = document.getElementById("terminar");

    if (storageTipoClienteBEL === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }


    

  }

  irMenuBXI() {
    this.router.navigate(['/menuBXI']);
  }

}
