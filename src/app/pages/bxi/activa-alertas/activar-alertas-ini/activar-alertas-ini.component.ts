import { SesionBxiService } from './../../sesion-bxi.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

declare var jquery: any; // jquery
declare var $: any;

@Component({
  selector: 'app-activar-alertas',
  templateUrl: './activar-alertas-ini.component.html',

})
export class ActivarAlertasIniComponent implements OnInit {
  AlertasActivas = false;
  isChecked: any ;
  
  constructor( private router: Router, private service: SesionBxiService) { }

  ngOnInit() {
    
    this.isChecked = document.getElementById("thing");
    this.AlertasActivas = this.service.alertasActivas;
    
  }
  estaSeleccionado() {
    
    this.isChecked = document.getElementById("thing");
    
  }

}
