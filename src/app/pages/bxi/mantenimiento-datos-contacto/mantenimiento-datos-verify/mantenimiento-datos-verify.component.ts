import { SesionBxiService } from './../../sesion-bxi.service';
import { Component, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

@Component({
  selector: 'app-mantenimiento-datos-verify',
  templateUrl: './mantenimiento-datos-verify.component.html'
})
export class MantenimientoDatosVerifyComponent implements OnInit {
  
  NombreUser: string;
  Sic: string;
  Celular: string;
  CorreoElectronico: string;

  constructor(private service: SesionBxiService, private router: Router) { }

  ngOnInit() {

   this.NombreUser = this.service.NombreUsuario;
    this.Sic = this.service.infoUsuarioSIC;
    this.Celular = this.service.CelCliente;
    this.CorreoElectronico = this.service.EmailCliente;

  }

  irMenuBXI() {
    this.router.navigate(['/menuBXI']);
  }

}
