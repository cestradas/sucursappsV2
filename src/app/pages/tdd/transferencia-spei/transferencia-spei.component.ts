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
  @ViewChild("rRfcBeneficiario", { read: ElementRef })
  rRfcBeneficiario: ElementRef;

  numeroCuentaTitular: string;
  mostrarCuentaMascara: string;
  saldoDisponibleClienteTdd: string;
  idCuentaTitular: string;
  nombreSele: any = "";
  clabe: any = "";
  nombreBanco: any = "";
  bancoRecep: any = "";
  nombreBene: any = "";
  rfcBeneficiario: any = "";
  referencia: any = "";
  importe: any = "";
  descripcion: any = "";
  email: any = "";
  tamCuenta: any;
  auxTamCuenta: any = 1;
  myform: FormGroup;
  tipoCuentaTdd: string;
  listaBancos: any;
  nombreOperacion: any = 0;
  listaText: any;

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
      this.tipoCuentaTdd = mensaje.Producto;
      setTimeout(() => $("#_modal_please_wait").modal("hide"), 1000);
    });

    setTimeout(() => $("#_modal_please_wait").modal("hide"), 3000);

    this.myform = this.fb.group({
      numeroClabeF: [""],
      nombreBeneficiarioF: [""],
      rfcBeneficiarioF: ["", Validators.pattern(
        /^([A-ZÑ&, a-zñ&]{3,4})(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))([A-Z\d, a-z\d]{2})([A\d])$/
      )],
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
        $("#_modal_please_wait").modal("hide");

        let respuestaBancos = response.responseJSON;
          
          if ( respuestaBancos.Id === "1") {
            this_aux.listaBancos = respuestaBancos.ArrayBancos;
            this_aux.listaBancos.sort(this_aux.sortByProperty('NombreBanco'));  
            this_aux.listaBancos.forEach( function(value, key) {
              if (this_aux.includesL(value.NombreBanco, "BANORTE")) {
                value.Mostrar = '0';
              } else {
                value.Mostrar = '1';
              }
            });
          } else if (respuestaBancos.Id === "2") {
            this_aux.crearListaBancos();
          } else {
            this_aux.showErrorSucces(respuestaBancos);
          }  
        $("#_modal_please_wait").modal("hide");           
      },
      function(error) {
        console.error("El WS respondio incorrectamente");
        setTimeout(function() {
          this_aux.showErrorPromise(error);
        }, 500);
      }
    );
    setTimeout(() => {
      $("#_modal_please_wait").modal("hide");
    }, 5000);
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
        if (this_aux.listaBancos !== "" || this_aux.listaBancos !== null || this_aux.listaBancos !== undefined) {
          this_aux.listaBancos.sort(this_aux.sortByProperty('NombreBanco'));  
          this_aux.listaBancos.forEach( function(value, key) {
            if (this_aux.includesL(value.NombreBanco, "BANORTE")) {
              value.Mostrar = '0';
            } else {
              value.Mostrar = '1';
            }
          });
        }
        $("#_modal_please_wait").modal("hide");
      },
      function(error) {
        console.error("El WS respondio incorrectamente");
        setTimeout(function() {
          this_aux.showErrorPromise(error);
        }, 500);
      }
    );
    setTimeout(() => {
      $("#_modal_please_wait").modal("hide");
    }, 5000);
  }

  includesL(container, value) {
    let returnValue = false;
    let pos = String(container).indexOf(value);
   
    if (pos >= 0) {
      returnValue = true;
    }
    return returnValue;
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
  this_aux.rRfcBeneficiario.nativeElement.value = "";
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

    const controlRfcBenef: FormControl = new FormControl(
      this_aux.rRfcBeneficiario.nativeElement.value, 
      Validators.pattern(
        /^([A-ZÑ&, a-zñ&]{3,4})(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))([A-Z\d, a-z\d]{2})([A\d])$/
      )
    );
    this_aux.myform.setControl("rfcBeneficiarioF", controlRfcBenef);

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
      this_aux.consultaTablaCorpBancosService();
      console.log("Seleccionaste QUICK");
      const controlClabe: FormControl = new FormControl(
        // tslint:disable-next-line:max-line-length
        this_aux.rClabe.nativeElement.value, [Validators.required, Validators.pattern(/^([0-9]{1,})$/), Validators.minLength(16), Validators.maxLength(18)]);
      this_aux.myform.setControl("numeroClabeF", controlClabe);
    }

    if (operacion === "2") {       
      this_aux.consultaBancosNacionalesService();
      console.log("Seleccionaste TEF");
      const controlClabe: FormControl = new FormControl(
        // tslint:disable-next-line:max-line-length
        this_aux.rClabe.nativeElement.value, [Validators.required, Validators.pattern(/^([0-9]{1,})$/), Validators.minLength(16), Validators.maxLength(18)]);
      this_aux.myform.setControl("numeroClabeF", controlClabe);
    }

    document.getElementById("clabe").removeAttribute("disabled");
    document.getElementById("beneficiario").removeAttribute("disabled");
    document.getElementById("rfcBeneficiario").removeAttribute("disabled");
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

  showDetallePago(clabeBenRec, nombreBeneRec, refRec, importeRec, descripcionRec, correoRec, rfcBenRec) {
    const this_aux = this;

    this_aux.clabe = clabeBenRec;
    this_aux.importe = importeRec;
    this_aux.email = correoRec;
    this_aux.nombreBene = nombreBeneRec;
    this_aux.descripcion = descripcionRec;
    this_aux.referencia = refRec;
    this_aux.rfcBeneficiario = rfcBenRec;

    if ( this_aux.referencia === "") {
      document.getElementById("referenciaModal").style.display = 'none';
    }
    if ( this_aux.rfcBeneficiario === "") {
      document.getElementById("rfcModal").style.display = 'none';
    } else {
      document.getElementById("rfcModal").style.display = 'flex';
    }
    $("#confirmModal").modal("show");
  }

  cerrarModalConfirmModal() {
    $("#confirmModal").modal("toggle");
  }

  transferenciaSPEISoap(clabeBenRec, nombreBeneRec, refRec, importeRec, descripcionRec, correoRec, rfcBenRec): any {
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
      referencia: refRec,
      rfcBeneficiario: rfcBenRec.toUpperCase()
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

  transferenciaTEFSoap(clabeBenRec, nombreBeneRec, refRec, importeRec, descripcionRec, correoRec, rfcBenRec): any {
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
      concepto: descripcionRec.toUpperCase(),
      rfcBeneficiario: rfcBenRec.toUpperCase()
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

  iniciaPinpad() {

    const this_aux = this;
    $('#ModalTDDLogin2').modal('show');

  }


  confirmarTransaccion() {
    this._validaNipService.callPinPadTrans();
    const this_aux = this;

    document.getElementById('capturaInicio').style.display = 'none';
    document.getElementById('caputuraSesion').style.display = 'block';
    // $("#ModalTDDLogin").modal("show");

    $('#ModalTDDLogin2').modal('hide');

    let res;
    this._validaNipService.validarDatosrespuesta().then(
      mensaje => {

        res = this._validaNipService.respuestaNip.res;
        // console.log(res);

        if (res === true) {
          $('#ModalTDDLogin2').modal('hide');
          $('#_modal_please_wait').modal('show');
          if (this_aux.nombreOperacion === "1") {
            this_aux.transferenciaSPEISoap(this_aux.clabe, this_aux.nombreBene, this_aux.referencia,
              this_aux.importe, this_aux.descripcion, this_aux.email , this_aux.rfcBeneficiario);
          } else if (this_aux.nombreOperacion === "2") {
            this_aux.transferenciaTEFSoap(this_aux.clabe, this_aux.nombreBene, this_aux.referencia,
              this_aux.importe, this_aux.descripcion, this_aux.email, this_aux.rfcBeneficiario);
          }
          this._validaNipService.respuestaNip.res = "";
        } else {
          console.error("Mostrar modal las tarjetas no son iguales");
          document.getElementById('mnsError').innerHTML =   "Los datos proporcionados son incorrectos, favor de verificar.";
          $('#_modal_please_wait').modal('hide');
          $('#errorModal').modal('show');
          $('#ModalTDDLogin2').modal('hide');
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
      // console.log('importeF', data);
      // console.log('myform', this_aux.myform);
    });
    
  }

  validarSaldo(clabeBenRec, nombreBeneRec, refRec, importeRec, descripcionRec, correoRec, rfcBenRec) {
    const this_aux = this;
    let importeOpe = "";
    $('#_modal_please_wait').modal('show');
    importeOpe = this_aux.replaceSimbolo(importeRec);
    this._validaNipService.consultaTablaYValidaSaldo(importeOpe).then(
      function(response) {
        let DatosJSON = response.responseJSON;
        if (DatosJSON.Id === "1") {
          this_aux.showDetallePago(clabeBenRec, nombreBeneRec, refRec, importeOpe, descripcionRec, correoRec, rfcBenRec);
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
    // console.log(importeAux);

        return importeAux;
  }

  obtenerCuentaDestino(numCuenta) {
    const this_aux = this;

    //if (impor !== '') {

     // if (numCuenta !== '' && numCuenta !== '.' && numCuenta !== '-') {
     //   if (this_aux.nombreOperacion === "1") {
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
       /* } else if (this_aux.nombreOperacion === "2") {
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
        } */
  //     }
  }

  showErrorPromise(error) {
    // console.log(error);
    // tslint:disable-next-line:max-line-length
    document.getElementById('mnsError').innerHTML =   "El servicio no esta disponible, favor de intentar mas tarde";
    $('#_modal_please_wait').modal('hide');
    $('#errorModal').modal('show');
  }
  
  showErrorPromiseMoney(json) {
    // console.log(json.Id + json.MensajeAUsuario);
    document.getElementById('msgError').innerHTML =   "No fue posible confirmar la operación. Por favor verifica tu saldo.";
    $('#_modal_please_wait').modal('hide');
    $('#ModalErrorTransaccion').modal('show');
  }
  
  showErrorSucces(json) {
    // console.log(json.Id + json.MensajeAUsuario);
    if (json.Id === "2") {
      document.getElementById("mnsError").innerHTML =
        "El servicio no esta disponible, favor de intentar mas tarde";
    } else {
      document.getElementById("mnsError").innerHTML = json.MensajeAUsuario;
    }
    $('#_modal_please_wait').modal('hide');
    $("#errorModal").modal("show");
  }

  crearListaBancos() {
    const this_aux = this;
    this_aux.listaText = [{"NumeroOrden":"1","IdSecoban":"131","IdBanco":"58","NombreBanco":"BANCO FAMSA"},{"NumeroOrden":"2","IdSecoban":"012","IdBanco":"27","NombreBanco":"BBVA BANCOMER"},{"NumeroOrden":"3","IdSecoban":"014","IdBanco":"42","NombreBanco":"SANTANDER"},{"NumeroOrden":"4","IdSecoban":"021","IdBanco":"36","NombreBanco":"HSBC"},{"NumeroOrden":"5","IdSecoban":"044","IdBanco":"43","NombreBanco":"SCOTIABANK"},{"NumeroOrden":"50","IdSecoban":"102","IdBanco":"1","NombreBanco":"INVESTA BANK"},{"NumeroOrden":"90","IdSecoban":"062","IdBanco":"5","NombreBanco":"AFIRME"},{"NumeroOrden":"95","IdSecoban":"167","IdBanco":"104","NombreBanco":"CB JPMORGAN"},{"NumeroOrden":"100","IdSecoban":"103","IdBanco":"2","NombreBanco":"AMERICAN EXPRES"},{"NumeroOrden":"110","IdSecoban":"138","IdBanco":"67","NombreBanco":"ABC CAPITAL"},{"NumeroOrden":"120","IdSecoban":"128","IdBanco":"7","NombreBanco":"AUTOFIN"},{"NumeroOrden":"130","IdSecoban":"127","IdBanco":"8","NombreBanco":"AZTECA"},{"NumeroOrden":"170","IdSecoban":"001","IdBanco":"10","NombreBanco":"BANXICO"},{"NumeroOrden":"190","IdSecoban":"006","IdBanco":"19","NombreBanco":"BANCOMEXT"},{"NumeroOrden":"200","IdSecoban":"137","IdBanco":"65","NombreBanco":"BANCOPPEL"},{"NumeroOrden":"210","IdSecoban":"019","IdBanco":"20","NombreBanco":"BANJERCITO"},{"NumeroOrden":"220","IdSecoban":"106","IdBanco":"17","NombreBanco":"BAMSA"},{"NumeroOrden":"230","IdSecoban":"009","IdBanco":"21","NombreBanco":"BANOBRAS"},{"NumeroOrden":"260","IdSecoban":"058","IdBanco":"23","NombreBanco":"BANREGIO"},{"NumeroOrden":"270","IdSecoban":"166","IdBanco":"24","NombreBanco":"BANSEFI"},{"NumeroOrden":"280","IdSecoban":"060","IdBanco":"25","NombreBanco":"BANSI"},{"NumeroOrden":"290","IdSecoban":"129","IdBanco":"26","NombreBanco":"BARCLAYS"},{"NumeroOrden":"295","IdSecoban":"634","IdBanco":"106","NombreBanco":"FINCOMUN"},{"NumeroOrden":"305","IdSecoban":"606","IdBanco":"99","NombreBanco":"ESTRUCTURADORES"},{"NumeroOrden":"320","IdSecoban":"90626","IdBanco":"84","NombreBanco":"CBDEUTSCHE"},{"NumeroOrden":"330","IdSecoban":"601","IdBanco":"29","NombreBanco":"GBM"},{"NumeroOrden":"335","IdSecoban":"602","IdBanco":"40","NombreBanco":"MASARI"},{"NumeroOrden":"350","IdSecoban":"600","IdBanco":"28","NombreBanco":"MONEXCB"},{"NumeroOrden":"360","IdSecoban":"605","IdBanco":"46","NombreBanco":"VALUE"},{"NumeroOrden":"370","IdSecoban":"608","IdBanco":"52","NombreBanco":"VECTOR"},{"NumeroOrden":"395","IdSecoban":"637","IdBanco":"101","NombreBanco":"ORDER"},{"NumeroOrden":"430","IdSecoban":"143","IdBanco":"95","NombreBanco":"CIBANCO"},{"NumeroOrden":"450","IdSecoban":"126","IdBanco":"32","NombreBanco":"CREDIT SUISSE"},{"NumeroOrden":"470","IdSecoban":"030","IdBanco":"11","NombreBanco":"BAJIO"},{"NumeroOrden":"500","IdSecoban":"124","IdBanco":"33","NombreBanco":"DEUTSCHE"},{"NumeroOrden":"520","IdSecoban":"140","IdBanco":"63","NombreBanco":"CONSUBANCO"},{"NumeroOrden":"570","IdSecoban":"168","IdBanco":"35","NombreBanco":"HIPOTECARIA FED"},{"NumeroOrden":"610","IdSecoban":"036","IdBanco":"13","NombreBanco":"INBURSA"},{"NumeroOrden":"615","IdSecoban":"902","IdBanco":"100","NombreBanco":"INDEVAL"},{"NumeroOrden":"640","IdSecoban":"037","IdBanco":"15","NombreBanco":"INTERACCIONES"},{"NumeroOrden":"660","IdSecoban":"059","IdBanco":"16","NombreBanco":"INVEX"},{"NumeroOrden":"680","IdSecoban":"110","IdBanco":"39","NombreBanco":"JP MORGAN"},{"NumeroOrden":"720","IdSecoban":"042","IdBanco":"6","NombreBanco":"MIFEL"},{"NumeroOrden":"730","IdSecoban":"112","IdBanco":"31","NombreBanco":"BMONEX"},{"NumeroOrden":"740","IdSecoban":"132","IdBanco":"80","NombreBanco":"MULTIVA BANCO"},{"NumeroOrden":"760","IdSecoban":"135","IdBanco":"41","NombreBanco":"NAFIN"},{"NumeroOrden":"790","IdSecoban":"620","IdBanco":"70","NombreBanco":"PROFUTURO"},{"NumeroOrden":"800","IdSecoban":"133","IdBanco":"71","NombreBanco":"ACTINVER"},{"NumeroOrden":"810","IdSecoban":"136","IdBanco":"72","NombreBanco":"INTERCAM BANCO"},{"NumeroOrden":"833","IdSecoban":"646","IdBanco":"111","NombreBanco":"STP"},{"NumeroOrden":"845","IdSecoban":"108","IdBanco":"45","NombreBanco":"TOKYO"},{"NumeroOrden":"890","IdSecoban":"113","IdBanco":"47","NombreBanco":"VE POR MAS"},{"NumeroOrden":"900","IdSecoban":"40141","IdBanco":"93","NombreBanco":"VOLKSWAGEN"},{"NumeroOrden":"915","IdSecoban":"630","IdBanco":"87","NombreBanco":"CB INTERCAM"},{"NumeroOrden":"926","IdSecoban":"649","IdBanco":"124","NombreBanco":"OSKNDIA"},{"NumeroOrden":"929","IdSecoban":"648","IdBanco":"127","NombreBanco":"EVERCORE"},{"NumeroOrden":"931","IdSecoban":"652","IdBanco":"129","NombreBanco":"ASEA"},{"NumeroOrden":"934","IdSecoban":"653","IdBanco":"131","NombreBanco":"KUSPIT"},{"NumeroOrden":"935","IdSecoban":"145","IdBanco":"132","NombreBanco":"BBASE"},{"NumeroOrden":"937","IdSecoban":"655","IdBanco":"133","NombreBanco":"SOFIEXPRESS"},{"NumeroOrden":"938","IdSecoban":"656","IdBanco":"134","NombreBanco":"UNAGRA"},{"NumeroOrden":"940","IdSecoban":"90616","IdBanco":"85","NombreBanco":"FINAMEX"},{"NumeroOrden":"946","IdSecoban":"659","IdBanco":"138","NombreBanco":"ASP INTEGRA OPC"},{"NumeroOrden":"948","IdSecoban":"670","IdBanco":"139","NombreBanco":"LIBERTAD"},{"NumeroOrden":"952","IdSecoban":"147","IdBanco":"142","NombreBanco":"BANKAOOL"},{"NumeroOrden":"957","IdSecoban":"150","IdBanco":"145","NombreBanco":"INMOBILIARIO"},{"NumeroOrden":"958","IdSecoban":"623","IdBanco":"81","NombreBanco":"SKANDIA"},{"NumeroOrden":"959","IdSecoban":"151","IdBanco":"146","NombreBanco":"DONDE"},{"NumeroOrden":"960","IdSecoban":"152","IdBanco":"147","NombreBanco":"BANCREA"},{"NumeroOrden":"961","IdSecoban":"677","IdBanco":"148","NombreBanco":"CAJA POP MEXICA"},{"NumeroOrden":"962","IdSecoban":"148","IdBanco":"149","NombreBanco":"PAGATODO"},{"NumeroOrden":"965","IdSecoban":"678","IdBanco":"151","NombreBanco":"SURA"},{"NumeroOrden":"966","IdSecoban":"901","IdBanco":"152","NombreBanco":"CLSBANK"},{"NumeroOrden":"968","IdSecoban":"636","IdBanco":"154","NombreBanco":"HDI SEGUROS"},{"NumeroOrden":"971","IdSecoban":"628","IdBanco":"92","NombreBanco":"ZURICHVI"},{"NumeroOrden":"972","IdSecoban":"627","IdBanco":"155","NombreBanco":"ZURICH"},{"NumeroOrden":"974","IdSecoban":"631","IdBanco":"90","NombreBanco":"CI BOLSA"},{"NumeroOrden":"975","IdSecoban":"617","IdBanco":"156","NombreBanco":"VALMEX"},{"NumeroOrden":"976","IdSecoban":"674","IdBanco":"157","NombreBanco":"AXA"},{"NumeroOrden":"977","IdSecoban":"671","IdBanco":"158","NombreBanco":"HUASTECAS"},{"NumeroOrden":"980","IdSecoban":"685","IdBanco":"161","NombreBanco":"FONDO (FIRA)"},{"NumeroOrden":"981","IdSecoban":"680","IdBanco":"162","NombreBanco":"CRISTOBAL COLON"},{"NumeroOrden":"982","IdSecoban":"683","IdBanco":"163","NombreBanco":"CAJA TELEFONIST"},{"NumeroOrden":"983","IdSecoban":"686","IdBanco":"164","NombreBanco":"INVERCAP"},{"NumeroOrden":"985","IdSecoban":"687","IdBanco":"166","NombreBanco":"INFONAVIT"},{"NumeroOrden":"986","IdSecoban":"679","IdBanco":"167","NombreBanco":"FND"},{"NumeroOrden":"987","IdSecoban":"689","IdBanco":"168","NombreBanco":"FOMPED"},{"NumeroOrden":"995","IdSecoban":"691","IdBanco":"175","NombreBanco":"-"},{"NumeroOrden":"996","IdSecoban":"156","IdBanco":"176","NombreBanco":"SABADELL"},{"NumeroOrden":"998","IdSecoban":"154","IdBanco":"177","NombreBanco":"BANCO FINTERRA"},{"NumeroOrden":"999","IdSecoban":"155","IdBanco":"178","NombreBanco":"ICBC"},{"NumeroOrden":"1000","IdSecoban":"613","IdBanco":"179","NombreBanco":"MULTIVA CBOLSA"},{"NumeroOrden":"1005","IdSecoban":"158","IdBanco":"182","NombreBanco":"MIZUHO BANK"},{"NumeroOrden":"23187","IdSecoban":"072","IdBanco":"22","NombreBanco":"BANORTE\/IXE"},{"NumeroOrden":"23209","IdSecoban":"613","IdBanco":"55","NombreBanco":"MULTIVA CBOLSA"},{"NumeroOrden":"23210","IdSecoban":"614","IdBanco":"56","NombreBanco":"ACCIVAL"},{"NumeroOrden":"23228","IdSecoban":"90617","IdBanco":"89","NombreBanco":"VALMEX"},{"NumeroOrden":"23230","IdSecoban":"627","IdBanco":"91","NombreBanco":"ZURICH"},{"NumeroOrden":"23238","IdSecoban":"614","IdBanco":"103","NombreBanco":"ACCIVAL"},{"NumeroOrden":"23241","IdSecoban":"638","IdBanco":"108","NombreBanco":"AKALA"},{"NumeroOrden":"23245","IdSecoban":"572","IdBanco":"125","NombreBanco":"GEM-BANORTE\/IXE"},{"NumeroOrden":"23403","IdSecoban":"130","IdBanco":"321","NombreBanco":"COMPARTAMOS"},{"NumeroOrden":"23404","IdSecoban":"153","IdBanco":"322","NombreBanco":"PROGRESO"},{"NumeroOrden":"23405","IdSecoban":"157","IdBanco":"323","NombreBanco":"SHINHAN"},{"NumeroOrden":"23406","IdSecoban":"159","IdBanco":"324","NombreBanco":"BANK OF CHINA"},{"NumeroOrden":"23407","IdSecoban":"160","IdBanco":"325","NombreBanco":"BANCO S3"},{"NumeroOrden":"23408","IdSecoban":"621","IdBanco":"326","NombreBanco":"CB ACTINVER"},{"NumeroOrden":"23409","IdSecoban":"676","IdBanco":"327","NombreBanco":"C.B. INBURSA"},{"NumeroOrden":"23410","IdSecoban":"684","IdBanco":"328","NombreBanco":"TRANSFER"},{"NumeroOrden":"23411","IdSecoban":"688","IdBanco":"329","NombreBanco":"CREDICLUB"},{"NumeroOrden":"23412","IdSecoban":"690","IdBanco":"330","NombreBanco":"SURA"},{"NumeroOrden":"23413","IdSecoban":"692","IdBanco":"331","NombreBanco":"XXI"},{"NumeroOrden":"23414","IdSecoban":"693","IdBanco":"332","NombreBanco":"CBCREDITSUISSE"},{"NumeroOrden":"23415","IdSecoban":"695","IdBanco":"333","NombreBanco":"TE CREEMOS"},{"NumeroOrden":"23416","IdSecoban":"696","IdBanco":"334","NombreBanco":"SC PROM Y OP"},{"NumeroOrden":"23417","IdSecoban":"697","IdBanco":"335","NombreBanco":"CAPITAL ACTIVO"},{"NumeroOrden":"23419","IdSecoban":"998","IdBanco":"337","NombreBanco":"BanCobro"},{"NumeroOrden":"23420","IdSecoban":"999","IdBanco":"338","NombreBanco":"Validador"},{"NumeroOrden":"23421","IdSecoban":"999","IdBanco":"339","NombreBanco":"Banco F\u00e1cil"},{"NumeroOrden":"23682","IdSecoban":"301","IdBanco":"345","NombreBanco":"MEMBER_A"},{"NumeroOrden":"23683","IdSecoban":"314","IdBanco":"346","NombreBanco":"GEM-SANTANDES"},{"NumeroOrden":"23684","IdSecoban":"315","IdBanco":"347","NombreBanco":"GEM-MIFEL2"},{"NumeroOrden":"23685","IdSecoban":"321","IdBanco":"348","NombreBanco":"GEM-HSBC3"},{"NumeroOrden":"23686","IdSecoban":"324","IdBanco":"349","NombreBanco":"GEM-ACTINVER"},{"NumeroOrden":"23687","IdSecoban":"412","IdBanco":"350","NombreBanco":"GEM-BANCOMER2"},{"NumeroOrden":"23688","IdSecoban":"414","IdBanco":"351","NombreBanco":"GEM-SANTANDE"},{"NumeroOrden":"23689","IdSecoban":"421","IdBanco":"352","NombreBanco":"GEM-HSBC2"},{"NumeroOrden":"23690","IdSecoban":"444","IdBanco":"353","NombreBanco":"GEM-INVERLAT2"},{"NumeroOrden":"23691","IdSecoban":"450","IdBanco":"354","NombreBanco":"GEM-INMOBIMEX"},{"NumeroOrden":"23692","IdSecoban":"451","IdBanco":"355","NombreBanco":"GEM-DONDE"},{"NumeroOrden":"23693","IdSecoban":"452","IdBanco":"356","NombreBanco":"GEM-BM BANCREA"},{"NumeroOrden":"23694","IdSecoban":"501","IdBanco":"357","NombreBanco":"GEM-BANXICO"},{"NumeroOrden":"23695","IdSecoban":"502","IdBanco":"358","NombreBanco":"GEM-BANAMEX"},{"NumeroOrden":"23696","IdSecoban":"506","IdBanco":"359","NombreBanco":"GEM-BANCOMEXT"},{"NumeroOrden":"23697","IdSecoban":"509","IdBanco":"360","NombreBanco":"GEM-BANOBRAS"},{"NumeroOrden":"23698","IdSecoban":"512","IdBanco":"361","NombreBanco":"GEM-BANCOMER"},{"NumeroOrden":"23699","IdSecoban":"514","IdBanco":"362","NombreBanco":"GEM-SANTANDER"},{"NumeroOrden":"23700","IdSecoban":"519","IdBanco":"363","NombreBanco":"GEM-BANJERCITO"},{"NumeroOrden":"23701","IdSecoban":"521","IdBanco":"364","NombreBanco":"GEM-HSBC"},{"NumeroOrden":"23702","IdSecoban":"530","IdBanco":"365","NombreBanco":"GEM-BAJIO"},{"NumeroOrden":"23703","IdSecoban":"536","IdBanco":"366","NombreBanco":"GEM-INBURSA"},{"NumeroOrden":"23704","IdSecoban":"537","IdBanco":"367","NombreBanco":"GEM-INTERACCION"},{"NumeroOrden":"23705","IdSecoban":"542","IdBanco":"368","NombreBanco":"GEM-MIFEL"},{"NumeroOrden":"23706","IdSecoban":"544","IdBanco":"369","NombreBanco":"GEM-INVERLAT"},{"NumeroOrden":"23707","IdSecoban":"558","IdBanco":"370","NombreBanco":"GEM-BANREGIO"},{"NumeroOrden":"23708","IdSecoban":"559","IdBanco":"371","NombreBanco":"GEM-INVEX"},{"NumeroOrden":"23709","IdSecoban":"560","IdBanco":"372","NombreBanco":"GEM-BANSI"},{"NumeroOrden":"23710","IdSecoban":"562","IdBanco":"373","NombreBanco":"GEM-AFIRME"},{"NumeroOrden":"23711","IdSecoban":"566","IdBanco":"374","NombreBanco":"GEM-BANSEFI"},{"NumeroOrden":"23712","IdSecoban":"602","IdBanco":"375","NombreBanco":"GEM-ABNAMRO"},{"NumeroOrden":"23713","IdSecoban":"603","IdBanco":"376","NombreBanco":"GEM-AMEX"},{"NumeroOrden":"23714","IdSecoban":"606","IdBanco":"377","NombreBanco":"GEM-BAMSA"},{"NumeroOrden":"23715","IdSecoban":"608","IdBanco":"378","NombreBanco":"GEM-TOKYO"},{"NumeroOrden":"23716","IdSecoban":"610","IdBanco":"379","NombreBanco":"GEM-JPMORGAN"},{"NumeroOrden":"23717","IdSecoban":"613","IdBanco":"380","NombreBanco":"GEM-VE POR MAS"},{"NumeroOrden":"23718","IdSecoban":"624","IdBanco":"381","NombreBanco":"GEM-DEUTSCHE"},{"NumeroOrden":"23719","IdSecoban":"626","IdBanco":"382","NombreBanco":"GEM-CREDIT SUIS"},{"NumeroOrden":"23720","IdSecoban":"627","IdBanco":"383","NombreBanco":"GEM-AZTECA"},{"NumeroOrden":"23721","IdSecoban":"628","IdBanco":"384","NombreBanco":"GEM-AUTOFIN"},{"NumeroOrden":"23722","IdSecoban":"629","IdBanco":"385","NombreBanco":"GEM-BARCLAYS"},{"NumeroOrden":"23723","IdSecoban":"630","IdBanco":"386","NombreBanco":"GEM-COMPARTAMOS"},{"NumeroOrden":"23724","IdSecoban":"631","IdBanco":"387","NombreBanco":"GEM-FAMSA"},{"NumeroOrden":"23725","IdSecoban":"632","IdBanco":"388","NombreBanco":"GEM-MULTIVA"},{"NumeroOrden":"23726","IdSecoban":"633","IdBanco":"389","NombreBanco":"GEM-BCO ACTINVE"},{"NumeroOrden":"23727","IdSecoban":"635","IdBanco":"390","NombreBanco":"GEM-NAFIN"},{"NumeroOrden":"23728","IdSecoban":"636","IdBanco":"391","NombreBanco":"GEM-INTERCAM"},{"NumeroOrden":"23729","IdSecoban":"637","IdBanco":"392","NombreBanco":"GEM-BANCOPPEL"},{"NumeroOrden":"23730","IdSecoban":"638","IdBanco":"393","NombreBanco":"GEM-NORESTE"},{"NumeroOrden":"23731","IdSecoban":"640","IdBanco":"394","NombreBanco":"GEM-CONSUBANCO"},{"NumeroOrden":"23732","IdSecoban":"641","IdBanco":"395","NombreBanco":"GEM-VOLKSWAGEN"},{"NumeroOrden":"23733","IdSecoban":"653","IdBanco":"396","NombreBanco":"GEM-CHIHUAHUA"},{"NumeroOrden":"23734","IdSecoban":"654","IdBanco":"397","NombreBanco":"GEM-FINTERRA"},{"NumeroOrden":"23735","IdSecoban":"668","IdBanco":"398","NombreBanco":"GEM-HIPOTECARIA"},{"NumeroOrden":"23736","IdSecoban":"707","IdBanco":"399","NombreBanco":"GEM-GBM"},{"NumeroOrden":"23737","IdSecoban":"719","IdBanco":"400","NombreBanco":"GEM-VALUE"},{"NumeroOrden":"23738","IdSecoban":"721","IdBanco":"401","NombreBanco":"GEM-MONEX"},{"NumeroOrden":"23739","IdSecoban":"726","IdBanco":"402","NombreBanco":"GEM-CBDEUTSCHE"},{"NumeroOrden":"23740","IdSecoban":"737","IdBanco":"403","NombreBanco":"GEM-ORDER"},{"NumeroOrden":"23741","IdSecoban":"743","IdBanco":"404","NombreBanco":"GEM-CONSULTORIA"},{"NumeroOrden":"23742","IdSecoban":"767","IdBanco":"405","NombreBanco":"GEM-MASARI"},{"NumeroOrden":"23743","IdSecoban":"813","IdBanco":"406","NombreBanco":"GEM-MULTIVA"},{"NumeroOrden":"23744","IdSecoban":"814","IdBanco":"407","NombreBanco":"GEM-ACCIVAL"},{"NumeroOrden":"23745","IdSecoban":"816","IdBanco":"408","NombreBanco":"GEM-FINAMEX"},{"NumeroOrden":"23746","IdSecoban":"817","IdBanco":"409","NombreBanco":"GEM-VALMEX"},{"NumeroOrden":"23747","IdSecoban":"820","IdBanco":"410","NombreBanco":"GEM-PROFUTURO"},{"NumeroOrden":"23748","IdSecoban":"823","IdBanco":"411","NombreBanco":"GEM-ESTRUCTURAD"},{"NumeroOrden":"23749","IdSecoban":"826","IdBanco":"412","NombreBanco":"GEM-VECTOR"},{"NumeroOrden":"23750","IdSecoban":"827","IdBanco":"413","NombreBanco":"GEM-ZURICH"},{"NumeroOrden":"23751","IdSecoban":"828","IdBanco":"414","NombreBanco":"GEM-ZURICHVI"},{"NumeroOrden":"23752","IdSecoban":"830","IdBanco":"415","NombreBanco":"GEM-CB INTERCAM"},{"NumeroOrden":"23753","IdSecoban":"831","IdBanco":"416","NombreBanco":"GEM-CI BOLSA"},{"NumeroOrden":"23754","IdSecoban":"834","IdBanco":"417","NombreBanco":"GEM-FINCOMUN"},{"NumeroOrden":"23755","IdSecoban":"836","IdBanco":"418","NombreBanco":"GEM-HDI SEGUROS"},{"NumeroOrden":"23756","IdSecoban":"838","IdBanco":"419","NombreBanco":"GEM-AKALA"},{"NumeroOrden":"23757","IdSecoban":"840","IdBanco":"420","NombreBanco":"GEM-C.B. J.P. M"},{"NumeroOrden":"23758","IdSecoban":"842","IdBanco":"421","NombreBanco":"GEM-REFORMA"},{"NumeroOrden":"23759","IdSecoban":"846","IdBanco":"422","NombreBanco":"GEM-STP"},{"NumeroOrden":"23760","IdSecoban":"848","IdBanco":"423","NombreBanco":"GEM-EVERCORE"},{"NumeroOrden":"23761","IdSecoban":"849","IdBanco":"424","NombreBanco":"GEM-OSKNDIA"},{"NumeroOrden":"23762","IdSecoban":"852","IdBanco":"425","NombreBanco":"GEM-ASEA"},{"NumeroOrden":"23763","IdSecoban":"853","IdBanco":"426","NombreBanco":"GEMELO KUSPIT"},{"NumeroOrden":"23764","IdSecoban":"854","IdBanco":"427","NombreBanco":"GEM-BBASE"},{"NumeroOrden":"23765","IdSecoban":"856","IdBanco":"428","NombreBanco":"GEM-SOFIEXPRESS"},{"NumeroOrden":"23766","IdSecoban":"857","IdBanco":"429","NombreBanco":"GEM-UNAGRA"},{"NumeroOrden":"23767","IdSecoban":"858","IdBanco":"430","NombreBanco":"GEM-INDEVAL"},{"NumeroOrden":"23768","IdSecoban":"860","IdBanco":"431","NombreBanco":"GEM-ASP-FINANC"},{"NumeroOrden":"23769","IdSecoban":"861","IdBanco":"432","NombreBanco":"GEM-LIBERTAD"},{"NumeroOrden":"23770","IdSecoban":"871","IdBanco":"433","NombreBanco":"GEM-HUASTECAS"},{"NumeroOrden":"23772","IdSecoban":"876","IdBanco":"435","NombreBanco":"GEM-C.B. INBURS"},{"NumeroOrden":"23773","IdSecoban":"877","IdBanco":"436","NombreBanco":"GEM-CAJAPOPMEX"},{"NumeroOrden":"23774","IdSecoban":"878","IdBanco":"437","NombreBanco":"GEM-SURA"},{"NumeroOrden":"23775","IdSecoban":"879","IdBanco":"438","NombreBanco":"GEM-FINRURAL"},{"NumeroOrden":"23776","IdSecoban":"880","IdBanco":"439","NombreBanco":"GEM-CAJ CRISTOB"},{"NumeroOrden":"23777","IdSecoban":"881","IdBanco":"440","NombreBanco":"GEM-PRESTAMO"},{"NumeroOrden":"23778","IdSecoban":"883","IdBanco":"441","NombreBanco":"GEM-CAJA_TELMEX"},{"NumeroOrden":"23779","IdSecoban":"885","IdBanco":"442","NombreBanco":"GEM-FONDO"},{"NumeroOrden":"23780","IdSecoban":"886","IdBanco":"443","NombreBanco":"GEM-INVERCAP"},{"NumeroOrden":"23781","IdSecoban":"923","IdBanco":"444","NombreBanco":"GEM-SKANDIA"},{"NumeroOrden":"24081","IdSecoban":"303","IdBanco":"446","NombreBanco":"GEM-BANKOFCHINA"},{"NumeroOrden":"24083","IdSecoban":"455","IdBanco":"448","NombreBanco":"GEM-ICBC"},{"NumeroOrden":"24085","IdSecoban":"656","IdBanco":"450","NombreBanco":"GEM-SABADELL"},{"NumeroOrden":"24086","IdSecoban":"657","IdBanco":"451","NombreBanco":"GEM-SHINHAN"},{"NumeroOrden":"24087","IdSecoban":"658","IdBanco":"452","NombreBanco":"GEM-MIZUHO"},{"NumeroOrden":"24088","IdSecoban":"322","IdBanco":"453","NombreBanco":"GEM-HSBC_DES"},{"NumeroOrden":"24089","IdSecoban":"323","IdBanco":"454","NombreBanco":"GEM-HSBC4"},{"NumeroOrden":"24090","IdSecoban":"330","IdBanco":"455","NombreBanco":"GEM-DES_COMPART"},{"NumeroOrden":"24092","IdSecoban":"660","IdBanco":"457","NombreBanco":"GEM-BANCO S3"},{"NumeroOrden":"24093","IdSecoban":"884","IdBanco":"458","NombreBanco":"GEM-TRANSFER"},{"NumeroOrden":"24094","IdSecoban":"887","IdBanco":"459","NombreBanco":"GEM-INFONAVIT"},{"NumeroOrden":"24095","IdSecoban":"888","IdBanco":"460","NombreBanco":"GEM-CREDICLUB"},{"NumeroOrden":"24096","IdSecoban":"890","IdBanco":"461","NombreBanco":"GEM-SURAINVEST"},{"NumeroOrden":"24098","IdSecoban":"892","IdBanco":"463","NombreBanco":"GEM-XXI-BANORTE"},{"NumeroOrden":"24099","IdSecoban":"893","IdBanco":"464","NombreBanco":"GEM-CBCREDITS"},{"NumeroOrden":"24100","IdSecoban":"895","IdBanco":"465","NombreBanco":"GEM-TE CREEMOS"},{"NumeroOrden":"24101","IdSecoban":"896","IdBanco":"466","NombreBanco":"GEM-PROSA"},{"NumeroOrden":"24102","IdSecoban":"897","IdBanco":"467","NombreBanco":"GEM-CAPITAL ACT"},{"NumeroOrden":"24103","IdSecoban":"898","IdBanco":"468","NombreBanco":"GEM-BURSAMETRIC"},{"NumeroOrden":"24170","IdSecoban":"642","IdBanco":"120","NombreBanco":"REFORMA"},{"NumeroOrden":"24222","IdSecoban":"698","IdBanco":"336","NombreBanco":"BURSAMETRICA"},{"NumeroOrden":"24315","IdSecoban":"874","IdBanco":"434","NombreBanco":"GEM-AXA"},{"NumeroOrden":"24890","IdSecoban":"302","IdBanco":"445","NombreBanco":"GEM-BANAMEX2"},{"NumeroOrden":"24896","IdSecoban":"516","IdBanco":"456","NombreBanco":"GEM-INTERBANCO"},{"NumeroOrden":"25263","IdSecoban":"839","IdBanco":"471","NombreBanco":"GEM-EUROFIMEX"},{"NumeroOrden":"25441","IdSecoban":"997","IdBanco":"472","NombreBanco":"BanCobroB"},{"NumeroOrden":"25442","IdSecoban":"998","IdBanco":"473","NombreBanco":"BanCobroA"},{"NumeroOrden":"25622","IdSecoban":"891","IdBanco":"474","NombreBanco":"-"},{"NumeroOrden":"25624","IdSecoban":"002","IdBanco":"4","NombreBanco":"BANAMEX"},{"NumeroOrden":"25726","IdSecoban":"050","IdBanco":"475","NombreBanco":"WELLS FARGO BANK"}];
    this_aux.listaBancos = this_aux.listaText;
    this_aux.listaBancos.sort(this_aux.sortByProperty('NombreBanco')); 
    this_aux.listaBancos.forEach( function(value, key) {
      if (this_aux.includesL(value.NombreBanco, "BANORTE")) {
        value.Mostrar = '0';
      } else {
        value.Mostrar = '1';
      }
    }); 
  }
}
