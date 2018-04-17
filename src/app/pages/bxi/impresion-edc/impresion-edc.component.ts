import { Autenticacion } from './../autenticacion';
import { SesionBxiService } from './../sesion-bxi.service';
import { OperacionesBXI } from './../operacionesBXI';
import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgControl, FormControl } from '@angular/forms';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';


declare var jquery: any; // jquery
declare var $: any;

@Component({
  selector: 'app-impresion-edc',
  templateUrl: './impresion-edc.component.html',
  styles: []
})
export class ImpresionEdcComponent implements OnInit {

  

  constructor(private router: Router, private service: SesionBxiService, private renderer: Renderer2,  private fb: FormBuilder) {

  

   }



  ngOnInit() {
  }


  operacion(id) {

    const this_aux = this;

    if (id ===  '1') {
      // Envio por correo

      this_aux.router.navigate(['/impresion_EDC_Finish']);

    } else {
      // Imprimir

    }


  }

}
