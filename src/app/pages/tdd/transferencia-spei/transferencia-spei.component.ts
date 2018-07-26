import { Component, OnInit, Renderer2, ViewChild, ElementRef } from "@angular/core";
import { ValidaNipTransaccion } from '../../../services/validaNipTrans/validaNipTrans.service';
import { ConsultaSaldosTddService } from "../../../services/saldosTDD/consultaSaldos.service";
import { Http, Response, Headers } from "@angular/http";
import { Injectable } from "@angular/core";
import { FormsModule, NgForm, FormGroup, FormControl, Validators, FormArray, FormBuilder} from "@angular/forms";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from "@angular/router";
import { CurrencyPipe } from "@angular/common";
import $ from 'jquery';
import { refCount } from "rxjs/operators";
import { ResponseWS } from '../../../services/response/response.service';
import { consultaCatalogos } from '../../../services/consultaCatalogos/consultaCatalogos.service';

declare var $: any;


@Component({
  selector: "app-transferencia-spei",
  templateUrl: "./transferencia-spei.component.html"
})
export class TransferenciaSpeiComponent implements OnInit {
  @ViewChild("rClabe", { read: ElementRef })
  rClabe: ElementRef;
  @ViewChild("rBeneficiario", { read: ElementRef })
  rBeneficiario: ElementRef;
  @ViewChild("rDescripcion", { read: ElementRef })
  rDescripcion: ElementRef;
  @ViewChild("rImporte", { read: ElementRef })
  rImporte: ElementRef;
  @ViewChild("rReferencia", { read: ElementRef })
  rReferencia: ElementRef;
  @ViewChild("rEmail", { read: ElementRef })
  rEmail: ElementRef;

  numeroCuentaTitular: string;
  mostrarCuentaMascara: string;
  saldoDisponibleClienteTdd: string;
  idCuentaTitular: string;
  nombreSele: any = "";
  clabe: any = "";
  nombreBanco: any = "";
  bancoRecep: any = "";
  nombreBene: any = "";
  referencia: any = "";
  importe: any = "";
  descripcion: any = "";
  email: any = "";
  tamCuenta: any;
  auxTamCuenta: any = 1;
  myform: FormGroup;

  listaBancos: any;
  nombreOperacion: any = 0;

  constructor(
    public fb: FormBuilder,
    private _service: ConsultaSaldosTddService,
    private _validaNipService: ValidaNipTransaccion,
    private router: Router,
    private serviceTransferenciaSpei: ResponseWS,
    private currencyPipe: CurrencyPipe
  ) {
    this._service.cargarSaldosTDD();

    $("#_modal_please_wait").modal("show");
    this._service.validarDatosSaldoTdd().then(mensaje => {
      const operaciones: consultaCatalogos = new consultaCatalogos();
      console.log("Saldos cargados correctamente TDD");
      this.saldoDisponibleClienteTdd = mensaje.SaldoDisponible;
      this.numeroCuentaTitular = mensaje.NumeroCuenta;
      this.mostrarCuentaMascara = operaciones.mascaraNumeroCuenta(this.numeroCuentaTitular);
      this.idCuentaTitular = mensaje.Id;
      setTimeout(() => $("#_modal_please_wait").modal("hide"), 1000);
    });

    setTimeout(() => $("#_modal_please_wait").modal("hide"), 3000);

    this.myform = this.fb.group({
      numeroClabeF: [""],
      nombreBeneficiarioF: [""],
      descripcionF: [""],
      importeF: ["", Validators.pattern( /^([0-9]{1,})+((?:\.){0,1}[0-9]{0,})$/)],
      // referenciaF: ["", Validators.pattern( /^([0-9]{1,})+((?:\.){0,1}[0-9]{0,})/)],
      referenciaF: ["",  Validators.pattern(/^([0-9]{1,})$/)],
      correoF: [""]
    });
  }

  ngOnInit() {

    localStorage.removeItem("des");
    localStorage.removeItem("np");
    localStorage.removeItem("res");
    localStorage.removeItem("tr2");
    localStorage.removeItem("tr2_serv");
    localStorage.removeItem("np_serv");
    localStorage.removeItem("res_serv");

    //ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnContinuar = document.getElementById("continuarspei");
    let btnContinuar2 = document.getElementById("continuar");

    if (storageTipoClienteTar === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
      btnContinuar2.classList.remove("color-botones");
      btnContinuar2.classList.add("color-botones_Preferente");
    } 

    $( ".cdk-visually-hidden" ).css( "margin-top", "-45%" );      
    $( ".cdk-overlay-container" ).css( "z-index", "1050 !important;" );  
  }

  consultaBancosNacionalesService() {
    const this_aux = this;
    this_aux.listaBancos = null;
    $("#_modal_please_wait").modal("show");
    const resourceRequest = new WLResourceRequest(
      "adapters/AdapterBanorteSucursApps/resource/consultaBancosNacionales",
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.send().then(
      function(response) {
        this_aux.listaBancos = response.responseJSON;
        this_aux.listaBancos.sort(this_aux.sortByProperty('NombreBanco'));
        $("#_modal_please_wait").modal("hide");
      },
      function(error) {
        console.error("El WS respondio incorrectamente");
        setTimeout(function() {
          this_aux.showErrorPromise(error);
        }, 500);
      }
    );
  }

  consultaTablaCorpBancosService() {
    const this_aux = this;
    this_aux.listaBancos = null;
    $("#_modal_please_wait").modal("show");
    const resourceRequest = new WLResourceRequest(
      "adapters/AdapterBanorteSucursApps/resource/consultaTablaCorporativaBancos",
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.send().then(
      function(response) {
        this_aux.listaBancos = response.responseJSON;
        this_aux.listaBancos.sort(this_aux.sortByProperty('NombreBanco'));
        $("#_modal_please_wait").modal("hide");
      },
      function(error) {
        console.error("El WS respondio incorrectamente");
        setTimeout(function() {
          this_aux.showErrorPromise(error);
        }, 500);
      }
    );
  }

  sortByProperty = function (property) {

    return function (x, y) {

        return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));

    };

};

limpiarFormulario () {
  const this_aux = this;

  this_aux.rClabe.nativeElement.value = "";
  this_aux.rBeneficiario.nativeElement.value = "";
  this_aux.rDescripcion.nativeElement.value = "";
  this_aux.rImporte.nativeElement.value = "";
  this_aux.rReferencia.nativeElement.value = "";
  this_aux.rEmail.nativeElement.value = "";
}

  seleccionOperacion(operacion) {
    const this_aux = this;
    this_aux.limpiarFormulario();
    this_aux.nombreOperacion = operacion;

    const controlNombrenBenef: FormControl = new FormControl(
      this_aux.rBeneficiario.nativeElement.value,
      Validators.required
    );
    this_aux.myform.setControl("nombreBeneficiarioF", controlNombrenBenef);
    const controlDescripcion: FormControl = new FormControl(
      this_aux.rDescripcion.nativeElement.value,
      Validators.required
    );
    this_aux.myform.setControl("descripcionF", controlDescripcion);

    // const controlImporte: FormControl = new FormControl('', Validators.required);
    // this_aux.myform.setControl("importeF", controlImporte);

    const controlReferencia: FormControl = new FormControl(
      this_aux.rReferencia.nativeElement.value,
      [Validators.maxLength(7), Validators.required, Validators.pattern(/^([0-9]{1,})$/)]
    );
    this_aux.myform.setControl("referenciaF", controlReferencia);
    const controlCorreo: FormControl = new FormControl(
      this_aux.rEmail.nativeElement.value, [
      Validators.required, Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)]
    );
    this_aux.myform.setControl("correoF", controlCorreo);
    if (operacion === "1") {
      document.getElementById('clabeTarjeta').innerHTML = "Clabe / Número de Tarjeta:";           
      this_aux.consultaTablaCorpBancosService();
      console.log("Seleccionaste QUICK");
      const controlClabe: FormControl = new FormControl(
        // tslint:disable-next-line:max-line-length
        this_aux.rClabe.nativeElement.value, [Validators.required, Validators.pattern(/^([0-9]{1,})$/), Validators.minLength(16), Validators.maxLength(18)]);
      this_aux.myform.setControl("numeroClabeF", controlClabe);
    }

    if (operacion === "2") {
      document.getElementById('clabeTarjeta').innerHTML = "Número de Tarjeta:";         
      this_aux.consultaBancosNacionalesService();
      console.log("Seleccionaste TEF");
      const controlClabe: FormControl = new FormControl(
        // tslint:disable-next-line:max-line-length
        this_aux.rClabe.nativeElement.value, [Validators.required, Validators.pattern(/^([0-9]{1,})$/), Validators.minLength(16), Validators.maxLength(16)]);
      this_aux.myform.setControl("numeroClabeF", controlClabe);
    }

    document.getElementById("clabe").removeAttribute("disabled");
    document.getElementById("beneficiario").removeAttribute("disabled");
    document.getElementById("descripcion").removeAttribute("disabled");
    document.getElementById("importe").removeAttribute("disabled");
    document.getElementById("referencia").removeAttribute("disabled");
    document.getElementById("email").removeAttribute("disabled");
  }

  selectBanco(bancoSeleccionado) {
    const this_aux = this;

    this_aux.bancoRecep = bancoSeleccionado;

    this_aux.nombreSele = document.getElementById("selecBanco");
    this_aux.nombreBanco =
      this_aux.nombreSele.options[this_aux.nombreSele.selectedIndex].text;
  }

  showDetallePago(
    clabeBenRec,
    nombreBeneRec,
    refRec,
    importeRec,
    descripcionRec,
    correoRec
  ) {
    const this_aux = this;

    this_aux.clabe = clabeBenRec;
    this_aux.importe = importeRec;
    this_aux.email = correoRec;
    this_aux.nombreBene = nombreBeneRec;
    this_aux.descripcion = descripcionRec;
    this_aux.referencia = refRec;

    if ( this_aux.referencia === "") {
      document.getElementById("referenciaModal").style.display = 'none';
    }
    $("#confirmModal").modal("show");
  }

  cerrarModalConfirmModal() {
    $("#confirmModal").modal("toggle");
  }

  transferenciaSPEISoap(
    clabeBenRec,
    nombreBeneRec,
    refRec,
    importeRec,
    descripcionRec,
    correoRec
  ): any {
    const this_aux = this;
    console.log("Inicia Transacccion Spei");

    let formParameters = {
      idCuenta: this_aux.idCuentaTitular,
      numeroCuenta: this_aux.numeroCuentaTitular,
      importe: importeRec,
      correo: correoRec,
      descripcion: descripcionRec.toUpperCase(),
      // bancoRecep: "40014",
      bancoRecep: this_aux.bancoRecep.trim(),
      clabeBeneficiario: clabeBenRec,
      nombreBene: nombreBeneRec.toUpperCase(),
      referencia: refRec
    };

    let respuestaSpei;

    const resourceRequest = new WLResourceRequest(
      "adapters/AdapterBanorteSucursApps2/resource/transferInterSPEI",
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        respuestaSpei = response.responseJSON;
        if (respuestaSpei.Id === "1") {
          const stringDatosSpei = JSON.stringify(respuestaSpei);
          this_aux.serviceTransferenciaSpei.datosTransferenciaSPEI = stringDatosSpei;
          this_aux.serviceTransferenciaSpei.nombreOperacion = "SPEI";
          $("#_modal_please_wait").modal("hide");
          this_aux.router.navigate(["/detalleTransferenciaSpei"]);
        } else {
          setTimeout(function() {
            $("#_modal_please_wait").modal("hide");
            this_aux.showErrorSucces(respuestaSpei);
          }, 500);
        }
      },
      function(error) {
        setTimeout(function() {
          this_aux.showErrorPromiseMoney(error);
        }, 500);
        console.log("Error al realizar Transacccion");
      }
    );
  }

  transferenciaTEFSoap(
    clabeBenRec,
    nombreBeneRec,
    refRec,
    importeRec,
    descripcionRec,
    correoRec
  ): any {
    const this_aux = this;
    console.log("Inicia Transacccion TEF");

    let formParameters = {
      numeroCuenta: this_aux.numeroCuentaTitular,
      bancoRecep: this_aux.bancoRecep.trim(),
      clabeBeneficiario: clabeBenRec,
      nombreBene: nombreBeneRec.toUpperCase(),
      correo: correoRec,
      importe: importeRec,
      referencia: refRec,
      concepto: descripcionRec.toUpperCase()
    };

    let respuestaTef;

    const resourceRequest = new WLResourceRequest(
      "adapters/AdapterBanorteSucursApps2/resource/transferInterTEF",
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        respuestaTef = response.responseJSON;
        if (respuestaTef.Id === "1") {
          const stringDatosTef = JSON.stringify(respuestaTef);
          this_aux.serviceTransferenciaSpei.datosTransferenciaSPEI = stringDatosTef;
          this_aux.serviceTransferenciaSpei.nombreOperacion = "TEF";
          $("#_modal_please_wait").modal("hide");
          this_aux.router.navigate(["/detalleTransferenciaSpei"]);
        } else {
          setTimeout(function() {
            $("#_modal_please_wait").modal("hide");
            this_aux.showErrorSucces(respuestaTef);
          }, 500);
        }
      },
      function(error) {
        setTimeout(function() {
          this_aux.showErrorPromiseMoney(error);
        }, 500);
        console.log("Error al realizar Transacccion");
      }
    );
  }


  confirmarTransaccion() {
    this._validaNipService.validaNipTrans();
    const this_aux = this;

    document.getElementById('capturaInicio').style.display = 'none';
    document.getElementById('caputuraSesion').style.display = 'block';
    $("#ModalTDDLogin").modal("show");

    let res;
    this._validaNipService.validarDatosrespuesta().then(
      mensaje => {

        res = this._validaNipService.respuestaNip.res;
        console.log(res);

        if (res === true) {
          $('#ModalTDDLogin').modal('hide');
          $('#_modal_please_wait').modal('show');
          if (this_aux.nombreOperacion === "1") {
            this_aux.transferenciaSPEISoap(
              this_aux.clabe,
              this_aux.nombreBene,
              this_aux.referencia,
              this_aux.importe,
              this_aux.descripcion,
              this_aux.email
            );
          } else if (this_aux.nombreOperacion === "2") {
            this_aux.transferenciaTEFSoap(
              this_aux.clabe,
              this_aux.nombreBene,
              this_aux.referencia,
              this_aux.importe,
              this_aux.descripcion,
              this_aux.email
            );
          }
          this._validaNipService.respuestaNip.res = "";
        } else {
          console.error("Mostrar modal las tarjetas no son iguales");
          document.getElementById('mnsError').innerHTML =   "Los datos proporcionados son incorrectos, favor de verificar.";
          $('#_modal_please_wait').modal('hide');
          $('#errorModal').modal('show');
          $('#ModalTDDLogin').modal('hide');
          this._validaNipService.respuestaNip.res = "";
        }
      }
    );
  }

  transformAmount(impor) {
    const this_aux = this;
    let importeAux = "";
    const expre2 =  /^([0-9]{1,})+((?:\.){0,1}[0-9]{0,})$/;

    //if (impor !== '') {

      if (impor !== '' && impor !== '.' && impor !== '-' && expre2.test(impor)) {
        importeAux = this_aux.replaceSimbolo(impor);
        this_aux.rImporte.nativeElement.value = this_aux.currencyPipe.transform(importeAux, 'USD');
        importeAux = this_aux.replaceSimbolo( this_aux.rImporte.nativeElement.value) ;
       }

  this_aux.myform.controls['importeF'].valueChanges.subscribe(
    data => {
      console.log('importeF', data);
      console.log('myform', this_aux.myform);
    });
    
  }

  validarSaldo(clabeBenRec, nombreBeneRec, refRec, importeRec, descripcionRec, correoRec) {
    const this_aux = this;
    let importeOpe = "";
    $('#_modal_please_wait').modal('show');
    importeOpe = this_aux.replaceSimbolo(importeRec);
    this._validaNipService.consultaTablaYValidaSaldo(importeOpe).then(
      function(response) {
        let DatosJSON = response.responseJSON;
        if (DatosJSON.Id === "1") {
          this_aux.showDetallePago(clabeBenRec, nombreBeneRec, refRec, importeOpe, descripcionRec, correoRec);
        } else if ( DatosJSON.Id === "4" ) {
          $('#modalLimiteDiario').modal('show');
        } else if ( DatosJSON.Id === "5" ) {
          $('#modalLimiteMensual').modal('show');
        } else {
          setTimeout(function() {
            $("#_modal_please_wait").modal("hide");
            this_aux.showErrorSucces(DatosJSON);
          }, 500);
        }
        setTimeout(function() {
          $('#_modal_please_wait').modal('hide');
        }, 500);
        
      }, function(error) {
        setTimeout(function() {
          this_aux.showErrorPromise(error);
        }, 500);
       
  });
  }

  replaceSimbolo(importe) {
    const this_aux = this;
    let importeAux = importe.replace('$', '');
    const re = /\,/g;
    importeAux = importeAux.replace(re, '');
    console.log(importeAux);

        return importeAux;
  }

  obtenerCuentaDestino(numCuenta) {
    const this_aux = this;

    //if (impor !== '') {

     // if (numCuenta !== '' && numCuenta !== '.' && numCuenta !== '-') {
        if (this_aux.nombreOperacion === "1") {
          if ((numCuenta.length === 16 || numCuenta.length === 18) ) { 
            this_aux.tamCuenta = 1;    
            this_aux.auxTamCuenta = 0;     
          } else if (numCuenta.length === 0) {
            this_aux.auxTamCuenta = 0;
          } else if (numCuenta.length === 17) {
            this_aux.tamCuenta = 0;
            this_aux.auxTamCuenta = 1;
          } else {
            this_aux.tamCuenta = 0;
            this_aux.auxTamCuenta = 0;
          }
        } else if (this_aux.nombreOperacion === "2") {
          if (numCuenta.length === 16 ) { 
            this_aux.tamCuenta = 1;  
            this_aux.auxTamCuenta = 0;   
           // this_aux.auxTamCuenta = 1;
          } else if (numCuenta.length === 0) {
            this_aux.auxTamCuenta = 0;
          } else if (numCuenta.length === 17) {
            this_aux.tamCuenta = 0;
            this_aux.auxTamCuenta = 1;
          } else {
            this_aux.tamCuenta = 0;
            this_aux.auxTamCuenta = 0;
          }
        }
  //     }
  }

  showErrorPromise(error) {
    console.log(error);
    // tslint:disable-next-line:max-line-length
    document.getElementById('mnsError').innerHTML =   "El servicio no esta disponible, favor de intentar mas tarde";
    $('#_modal_please_wait').modal('hide');
    $('#errorModal').modal('show');
  }
  
  showErrorPromiseMoney(json) {
    console.log(json.Id + json.MensajeAUsuario);
    document.getElementById('msgError').innerHTML =   "No fue posible confirmar la operación. Por favor verifica tu saldo.";
    $('#_modal_please_wait').modal('hide');
    $('#ModalErrorTransaccion').modal('show');
  }
  
  showErrorSucces(json) {
    console.log(json.Id + json.MensajeAUsuario);
    if (json.Id === "2") {
      document.getElementById("mnsError").innerHTML =
        "El servicio no esta disponible, favor de intentar mas tarde";
    } else {
      document.getElementById("mnsError").innerHTML = json.MensajeAUsuario;
    }
    $('#_modal_please_wait').modal('hide');
    $("#errorModal").modal("show");
  }
}
