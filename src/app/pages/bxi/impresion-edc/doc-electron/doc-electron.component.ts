import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Autenticacion } from './../../autenticacion';
import { SesionBxiService } from './../../sesion-bxi.service';
import { OperacionesBXI } from './../../operacionesBXI';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';


declare var jquery: any; // jquery
declare var $: any;

@Component({
  selector: 'app-doc-electron',
  templateUrl: './doc-electron.component.html',
  styleUrls: []
})

export class DocElectronComponent implements OnInit {

  constructor(private router: Router, private service: SesionBxiService, private renderer: Renderer2) {

    
    setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);

}

ngOnInit() {
  
  let crypto = require('crypto');
  console.log(crypto);

  let fs1 = require("fs");
   /*               
  let tmpFileName0 = 'c:/temp/electron/'+'D_1_'+ this.numDocumento +'_'+ 'fechasEnvioMail' + '.pdf';
                    
                   
  fs1.writeFile(tmpFileName0, documento.PDF, 'base64', function(err) {
                      
    if (err) {
                       
      return console.log(err);
      
    }
                
  });
  */

}

}
