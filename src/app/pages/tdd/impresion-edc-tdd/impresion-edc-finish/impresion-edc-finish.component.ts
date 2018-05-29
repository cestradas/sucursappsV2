import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgControl, FormControl } from '@angular/forms';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
@Component({
  selector: 'app-impresion-edc-finish',
  templateUrl: './impresion-edc-finish.component.html'
})
export class ImpresionEdcFinishComponent implements OnInit {

  forma: FormGroup;

  contraZip: string;
  confirmCorreo: string;
  correo: string;

  constructor() { 

    const this_aux = this;

    this_aux.forma = new FormGroup({

      'correo': new FormControl('', [Validators.required,  Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      'confCorreo': new FormControl('', [Validators.required,  Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      'contra': new FormControl('', [Validators.required, Validators.maxLength(10)])
     
    });

    console.log(this.forma);

    this.forma.controls['correo'].valueChanges.subscribe(
      data => {
        console.log('correo', data);
        console.log('forma', this.forma);
        
        this_aux.correo = data;
      });

      this.forma.controls['confCorreo'].valueChanges.subscribe(
        data => {
          console.log('confCorreo', data);
          console.log('forma', this.forma);

          this_aux.confirmCorreo = data;
        });

        this.forma.controls['contra'].valueChanges.subscribe(
          data => {
            console.log('contra', data);
            console.log('forma', this.forma);
  
            this_aux.contraZip = data;
          });

  }

  ngOnInit() {
  }

}
