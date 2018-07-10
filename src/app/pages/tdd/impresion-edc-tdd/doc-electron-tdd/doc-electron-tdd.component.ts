import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ResponseWS } from '../../../../services/response/response.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';


declare var jquery: any; // jquery
declare var $: any;

@Component({
  selector: 'app-doc-electron-tdd',
  templateUrl: './doc-electron-tdd.component.html'
})
export class DocElectronTddComponent implements OnInit {

  constructor(private router: Router, private renderer: Renderer2, private serviceTdd: ResponseWS) {

}

ngOnInit() {
  const this_aux = this;


  if ( this_aux.serviceTdd.validaMail === "1") {

    document.getElementById("msgUsuario").innerHTML = "Se ha realizado el envío de su estado cuenta a su dirección de correo electrónico.";

  } else {

    document.getElementById("msgUsuario").innerHTML = "La impresión del estado de cuenta ha terminado.";

  }  
  $('#_modal_please_wait').modal('hide');
}

}
