import { SesionBxiService } from './../../sesion-bxi.service';
import { Component, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

@Component({
  selector: 'app-activar-alertas-verify',
  templateUrl: './activar-alertas-verify.component.html'
})
export class ActivarAlertasVerifyComponent implements OnInit {

  NumCuenta: string;
  Email: string;
  Celular: string;
  constructor(private service: SesionBxiService, private router: Router) { }

  ngOnInit() {
  const tamNumCuenta = this.service.numCuentaSeleccionado.length;
  this.NumCuenta = this.service.numCuentaSeleccionado.substring(tamNumCuenta, tamNumCuenta - 4);
  this.Email = this.service.EmailCliente;
  this.Celular = this.service.CelCliente;
  }

  irMenuBXI() {
    this.router.navigate(['/menuBXI']);
  }

}
