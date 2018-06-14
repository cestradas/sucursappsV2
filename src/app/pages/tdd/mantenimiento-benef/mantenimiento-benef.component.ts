import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup,  Validators,  NgForm,  FormControl} from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { variable, THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Response } from "@angular/http";
import { equal } from "assert";
import { VALID, AbstractControl } from "@angular/forms/src/model";
import { validateConfig } from "@angular/router/src/config";
import { DatePipe } from "@angular/common";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { ResponseWS } from '../../../services/response/response.service';
import { ValidaNipTransaccion } from '../../../services/validaNipTrans/validaNipTrans.service';
import { ConsultaSaldosTddService } from '../../../services/saldosTDD/consultaSaldos.service';

declare var $: any;
declare var angular: any;

@Component({
  selector: "app-mantenimiento-benef",
  templateUrl: "./mantenimiento-benef.component.html"
})
export class MantenimientoBenefComponent implements OnInit {
  DatosJSON: any;
  BEN: any;
  DatosJSONCP: any;
  CP: any;

  @ViewChild("rColonias", { read: ElementRef }) rColonias: ElementRef; 
  @ViewChild("RApellidoPatAlta", { read: ElementRef }) RApellidoPatAlta: ElementRef;
  @ViewChild("RApellidoMatAlta", { read: ElementRef }) RApellidoMatAlta: ElementRef;
  @ViewChild("RPorcentajeAlta", { read: ElementRef }) RPorcentajeAlta: ElementRef;
  @ViewChild("RDescripcionEstadoAlta", { read: ElementRef }) RDescripcionEstadoAlta: ElementRef;
  @ViewChild("RDescripcionDelegacionAlta", { read: ElementRef }) RDescripcionDelegacionAlta: ElementRef;
  @ViewChild("RNumeroCalleAlta", { read: ElementRef }) RNumeroCalleAlta: ElementRef;
  @ViewChild("RNumeroDepartamentoAlta", { read: ElementRef }) RNumeroDepartamentoAlta: ElementRef;
  @ViewChild("RFisicaMoralSelecAlta", { read: ElementRef }) RFisicaMoralSelecAlta: ElementRef;
  @ViewChild("RFechaNacimientoAlta", { read: ElementRef }) RFechaNacimientoAlta: ElementRef;
  @ViewChild("RParentescoAlta", { read: ElementRef }) RParentescoAlta: ElementRef;

  @ViewChild("RColoniasM", { read: ElementRef }) RColoniasM: ElementRef;
  @ViewChild("RApellidoMat", { read: ElementRef }) RApellidoMat: ElementRef;
  @ViewChild("RPorcentaje", { read: ElementRef }) RPorcentaje: ElementRef;
  @ViewChild("RDescripcionEstado", { read: ElementRef }) RDescripcionEstado: ElementRef;
  @ViewChild("RDescripcionDelegacion", { read: ElementRef }) RDescripcionDelegacion: ElementRef;
  @ViewChild("RNumeroCalle", { read: ElementRef }) RNumeroCalle: ElementRef;
  @ViewChild("RNumeroDepartamento", { read: ElementRef }) RNumeroDepartamento: ElementRef;
  @ViewChild("RFisicaMoralSelec", { read: ElementRef }) RFisicaMoralSelec: ElementRef;
  
  
  
  tamRegistrosBenef: any = 0;
  contadorModificaciones: any = [];
  contadorAltas: any = 0;
  arrayBajas: any = [];
  consecutivoSeleccionado: any = "";
  mostrarFechaFormat: any;
  porcentajeGuardado: any = 0;
  ultimoRegistroGuardado: any = 0;
  codigoPvacio: any = 0;
  opcion: any = 0;
  bloquearAlta: any = false;
  numeroCuentaTitular: string;
  saldoDisponibleClienteTdd: string;

  registroFederal: any = "";
  fisicaMoralSeleccionada: any = "";
  fechaNacimiento: any = "";
  nombreBeneficiario: any = "";
  razonSocial: any = "";
  apellidoPat: any = "";
  apellidoMat: any = "";
  porcentaje: any = "";
  nombreCalle: any = "";
  numeroCalle: any = "";
  numeroDepartamento: any = "";
  descripcionColonia: any = "";
  codigoPostal: any = "";
  codigoDelegacion: any = "";
  descripcionDelegacion = "";
  codigoEstado: any = "";
  descripcionEstado: any = "";
  parentesco: any = "";

  myform: FormGroup;
  myformCP: FormGroup;
  myformCPMod: FormGroup;
  myformModificacion: FormGroup;

 A = false;
 B = false;
 C = false;

  constructor(public fb: FormBuilder, private router: Router, private serviceMantenimiento: ResponseWS,
     private _validaNipService: ValidaNipTransaccion, private _service: ConsultaSaldosTddService) {
      this._service.cargarSaldosTDD();
    this.myform = this.fb.group({
      nombreBenef: [''],
      apPatBenef: [''],
      fechaNacBenef: [''],
      nomCalleBenef: [''],
      parentescoBenef: [''],
      registroFC: [''],
      porcentajeBenef: ['']
    });

    this.myformCP = this.fb.group({
      CodPBenef: ['', [Validators.required, Validators.minLength(5),
        Validators.maxLength(5)]]
    });

    this.myformCPMod = this.fb.group({
      CodPBenefMod: ['']
    });

    $('#_modal_please_wait').modal('show');
    this._service.validarDatosSaldoTdd().then(
      mensaje => {

        console.log('Saldos cargados correctamente TDD');
        this.saldoDisponibleClienteTdd = mensaje.SaldoDisponible;
        this.numeroCuentaTitular = mensaje.NumeroCuenta;
        this.consultaBeneficiarios();
      }
    ); 
    setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);
  }

  ngOnInit() {

    //ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnAlta = document.getElementById("alta");
    let btnGuardar = document.getElementById("gardar");
    let btnGuardar2 = document.getElementById("guardar2");
    let btnCp = document.getElementById("cp");
    let btnCp2 = document.getElementById("cp2");
    let btnContinuar = document.getElementById("confirmar");
    let btnAceptar = document.getElementById("aceptar");
    let btnAceptar2 = document.getElementById("aceptar2");

    if (storageTipoClienteTar === "true") {

      btnAlta.classList.remove("color-botones");
      btnAlta.classList.add("color-botones_Preferente");
      btnGuardar.classList.remove("color-botones");
      btnGuardar.classList.add("color-botones_Preferente");
      btnCp.classList.remove("color-botones");
      btnCp.classList.add("color-botones_Preferente");
      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
      btnCp2.classList.remove("color-botones");
      btnCp2.classList.add("color-botones_Preferente");
      btnGuardar2.classList.remove("color-botones");
      btnGuardar2.classList.add("color-botones_Preferente");
      btnAceptar.classList.remove("color-botones");
      btnAceptar.classList.add("color-botones_Preferente");
      btnAceptar2.classList.remove("color-botones");
      btnAceptar2.classList.add("color-botones_Preferente");
    }

    $( ".cdk-visually-hidden" ).css( "margin-top", "17%" );
  }

  altaBeneficiario() {
    this.reiniciarInput();
    this.reiniciarValidaciones();
    $("#altaBenefModal").modal("show");
  }


  bajaBeneficiarioModal(datosBeneficiario) {
    this.consecutivoSeleccionado = datosBeneficiario.NumeroConsecutiv;
    this.nombreBeneficiario = "";
    this.apellidoPat = "";
    this.apellidoMat = "";
    this.razonSocial = "";
    if (datosBeneficiario.FisicaMoral === "F") {
      this.nombreBeneficiario = datosBeneficiario.NombreBeneficia;
      this.apellidoPat = datosBeneficiario.ApPaternoBenef;
      this.apellidoMat = datosBeneficiario.ApMaternoBenef;
    }
    this.opcion = datosBeneficiario.Opcion;
    if (datosBeneficiario.FisicaMoral === "M") {
      this.razonSocial = datosBeneficiario.RazonSocial;
    }    
    $("#modalBajaBeneficiarios").modal("show");
  }

  modificacionBeneficiarioModal(datosBeneficiario) {
    const this_aux = this;
    this_aux.reiniciarInput();
    this_aux.reiniciarValidaciones();

    this_aux.codigoPostal = datosBeneficiario.CodigoPostal; 
    this_aux.consultaCodigoPostalSoap(this_aux.codigoPostal);
    this_aux.consecutivoSeleccionado = datosBeneficiario.NumeroConsecutiv;
    this_aux.registroFederal = datosBeneficiario.RegistroFederal;
    this_aux.fechaNacimiento = datosBeneficiario.NuevaFecha;
    this_aux.porcentaje = datosBeneficiario.PorcentajeBenef;
    this_aux.nombreCalle = datosBeneficiario.NombreCalle;
    this_aux.numeroCalle = datosBeneficiario.NumeroCalle;
    this_aux.numeroDepartamento = datosBeneficiario.NumeroDepartamen;
    this_aux.parentesco = datosBeneficiario.Parentesco;   
    this_aux.descripcionColonia = datosBeneficiario.DescripcionColonia;
    this_aux.opcion = datosBeneficiario.Opcion;
    this_aux.apellidoPat = datosBeneficiario.ApPaternoBenef;
    this_aux.apellidoMat = datosBeneficiario.ApMaternoBenef; 
    if (datosBeneficiario.FisicaMoral === "F") {
      this_aux.nombreBeneficiario = datosBeneficiario.NombreBeneficia;    
      this_aux.fisicaMoralSeleccionada = "PERSONA FÍSICA";
    }
    if (datosBeneficiario.FisicaMoral === "M") {
      this_aux.razonSocial = datosBeneficiario.RazonSocial;
      this_aux.fisicaMoralSeleccionada = "PERSONA MORAL";
    }
    this_aux.fMModificacion();
    $("#modalModificacionBeneficiarios").modal("show");
  }

  abrirModalPorcentaje() {
    $("#porcentajeModal").modal("show");
  }

  reiniciarValidaciones() {
    const this_aux = this;

    const nombreBen: FormControl = new FormControl('', Validators.required);
    this_aux.myform.setControl('nombreBenef', nombreBen);
    const nombreCalle: FormControl = new FormControl('');
    this_aux.myform.setControl('nomCalleBenef', nombreCalle);
    const controlApellido: FormControl = new FormControl('');
    this_aux.myform.setControl('apPatBenef', controlApellido);
    const controlFisicoFecha: FormControl = new FormControl('');
    this_aux.myform.setControl('fechaNacBenef', controlFisicoFecha);
    const controlFisicoPar: FormControl = new FormControl('');
    this_aux.myform.setControl('parentescoBenef', controlFisicoPar);
    const controlrFc: FormControl = new FormControl('');
    this_aux.myform.setControl('registroFC', controlrFc);
    const controlCP: FormControl = new FormControl('');
    this_aux.myformCP.setControl('CodPBenef', controlCP);

      
  }
  reiniciarInput() {
    const this_aux = this;
    this_aux.myform.get('nombreBenef').setValue('', '');
    this_aux.myform.get('apPatBenef').setValue('', '');
    this_aux.myform.get('fechaNacBenef').setValue('', '');
    this_aux.myform.get('nomCalleBenef').setValue('', '');
    this_aux.myform.get('parentescoBenef').setValue('', '');
    this_aux.myform.get('registroFC').setValue('', '');
    this_aux.myformCP.get('CodPBenef').setValue('', '');
    
    this_aux.RFisicaMoralSelecAlta.nativeElement.value = "";
    this_aux.RApellidoMatAlta.nativeElement.value = "";
    this_aux.RPorcentajeAlta.nativeElement.value = "";
    this_aux.RDescripcionEstadoAlta.nativeElement.value = "";
    this_aux.RDescripcionDelegacionAlta.nativeElement.value = "";
    this_aux.RNumeroCalleAlta.nativeElement.value = "";
    this_aux.RNumeroDepartamentoAlta.nativeElement.value = "";
    this_aux.rColonias.nativeElement.value = "Seleccione Colonia";

    this.registroFederal = "";
    this.fisicaMoralSeleccionada = "";
    this.fechaNacimiento = "";
    this.nombreBeneficiario = "";
    this.razonSocial = "";
    this.apellidoPat = "";
    this.apellidoMat = "";
    this.porcentaje = "";
    this.nombreCalle = "";
    this.numeroCalle = "";
    this.numeroDepartamento = "";
    this.descripcionColonia = "";
    this.codigoPostal = "";
    this.codigoDelegacion = "";
    this.descripcionDelegacion = "";
    this.codigoEstado = "";
    this.descripcionEstado = "";
    this.parentesco = "";
    this.CP = null;
  }

  consultaBeneficiarios() {
    const this_aux = this;
    const THIS: any = this;
    console.log("adentro consultarBeneficiarios");
    console.log(this_aux.BEN);
    let anio: any = "";
    let mes: any = "";
    let dia: any = "";
    this_aux.tamRegistrosBenef = 0;
    this_aux.porcentajeGuardado = 0;

    const formParameters = {
      numeroCuenta: this_aux.numeroCuentaTitular
    };

    const resourceRequest = new WLResourceRequest(
       'adapters/AdapterBanorteSucursApps/resource/consultaMantenimientoBeneficiarios',
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        console.log(response.responseJSON);
        this_aux.DatosJSON = response.responseJSON;
        this_aux.BEN = this_aux.DatosJSON.ArrayBeneficiarios;

        if (this_aux.BEN === undefined) {
          $('#errorModal').modal('show');
          this_aux.bloquearAlta = true;
        } else {
          this_aux.BEN.forEach(function(value, key) {
            this_aux.tamRegistrosBenef = ++this_aux.tamRegistrosBenef;
            if (value.FechaNacimiento !== "00010101" && value.FechaNacimiento !== "19000101") {
              this_aux.mostrarFechaFormat = value.FechaNacimiento;
              anio = this_aux.mostrarFechaFormat.substring(0, 4);
              mes = this_aux.mostrarFechaFormat.substring(4, 6);
              dia = this_aux.mostrarFechaFormat.substring(6, 8);
              this_aux.mostrarFechaFormat = anio + "-" + mes + "-" + dia;
              value.NuevaFecha = this_aux.mostrarFechaFormat;
            } else {
              value.NuevaFecha = "";
            }
            this_aux.porcentajeGuardado = this_aux.porcentajeGuardado + Number(value.PorcentajeBenef);
            this_aux.ultimoRegistroGuardado = Number(value.NumeroConsecutiv);          
          });
          console.log("PORCENTAJE EN CONSULTA: " + this_aux.porcentajeGuardado);
          const stringDatosBen = JSON.stringify(this_aux.DatosJSON);
          this_aux.serviceMantenimiento.datosBeneficiarios = stringDatosBen;
          $('#_modal_please_wait').modal('hide');
        }
        
      },
      function(error) {
        $('#errorModal').modal('show');
        $('#_modal_please_wait').modal('hide');
        THIS.loading = false;
        this_aux.bloquearAlta = true;
        console.log("Error al consultar beneficiarios");
      }
    );
    console.log("Salió de Response Consultar Beneficiarios");
  }

  bajaBeneficiariosView () {
    const this_aux = this;
    
    this_aux.tamRegistrosBenef = --this_aux.tamRegistrosBenef;
    this_aux.BEN.forEach(function(value, index) {
      if (value.NumeroConsecutiv === this_aux.consecutivoSeleccionado) {
        if ( this_aux.opcion !== "A") {
          this_aux.arrayBajas.push({'NumeroConsecutiv': this_aux.consecutivoSeleccionado});
        }

        value.Opcion = 'B';
        this_aux.porcentajeGuardado = this_aux.porcentajeGuardado - Number(value.PorcentajeBenef); 
        value.PorcentajeBenef = "0";
      }
    });
    
    console.log("PORCENTAJE EN BAJA: " + this_aux.porcentajeGuardado);
  }

  bajaBeneficiarios () {
    const this_aux = this;
    this_aux.BEN.forEach(function(value, key) {
      if (value.Opcion === "B") {
        this_aux.bajaBeneficiariosSoap(value.NumeroConsecutiv);
      }
    });
  }

  bajaBeneficiariosSoap(numeroConsecutivoRec) {
    const this_aux = this;
    console.log("adentro BajaBeneficiarios");
    let respuestaBaja: any; 

    const THIS: any = this;

    const formParameters = {
      numeroCuenta: this_aux.numeroCuentaTitular,
      numeroConsecutivo: numeroConsecutivoRec
    };

    const resourceRequest = new WLResourceRequest(
       'adapters/AdapterBanorteSucursApps/resource/bajaMantenimientoBeneficiarios',
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        respuestaBaja = response.responseJSON;
        console.log("RESPUESTA BAJA: " + respuestaBaja);
        if (respuestaBaja.Id === "1") {
          const stringDetalleMantenimiento = JSON.stringify(this_aux.DatosJSON);
          this_aux.serviceMantenimiento.detalleMantenimiento = stringDetalleMantenimiento;
          this_aux.B = false;
          this_aux.verificaTransacciones();
          
        } else {
          $('#ModalErrorOperacion').modal('show');
        }
      }, function(error) {
        THIS.loading = false;
        console.log("Error al dar de baja beneficiario");
      }
    );
    console.log("Salió de Response Baja Beneficiario");
  }

  altaBeneficiarioView( myform1, myform2) {

    $('#altaBenefModal').modal('toggle');

    const this_aux = this;
      let patron = /-/g;
      let fechaFormato: any = "";
      fechaFormato = myform1.fechaNacBenef.replace(patron, "");

      let datosFM: any = "";
      this_aux.ultimoRegistroGuardado++;
      if (this_aux.fisicaMoralSeleccionada === '1') {
        this_aux.BEN.push({
          'NombreBeneficia': myform1.nombreBenef,
          'ApPaternoBenef': myform1.apPatBenef,
          'ApMaternoBenef': this_aux.RApellidoMatAlta.nativeElement.value,
          'CodigoPostal': this_aux.codigoPostal,
          'DescripDelegacion': this_aux.descripcionDelegacion,
          'DescripcionColonia': this_aux.rColonias.nativeElement.value,
          'DescripcionEdo': this_aux.descripcionEstado,
          'FechaNacimiento': fechaFormato,
          'NombreCalle': myform1.nomCalleBenef,
          'NumeroCalle': this_aux.RNumeroCalleAlta.nativeElement.value,
          'NumeroDepartamento': this_aux.RNumeroDepartamentoAlta.nativeElement.value,
          'Parentesco': myform1.parentescoBenef,
          'RegistroFederal': myform1.registroFC,
          'CodigoDelegacion': this_aux.codigoDelegacion,
          'CodigoEstado': this_aux.codigoEstado,
          'PorcentajeBenef': this_aux.RPorcentajeAlta.nativeElement.value,
          'Opcion': 'A',
          'FisicaMoral': 'F',
          'NuevaFecha':  myform1.fechaNacBenef,
          'NumeroConsecutiv': this_aux.ultimoRegistroGuardado 
          });
      } else {
        this_aux.BEN.push({
          'RazonSocial': myform1.nombreBenef,
          'CodigoPostal': this_aux.codigoPostal,
          'DescripDelegacion': this_aux.descripcionDelegacion,
          'DescripcionColonia': this_aux.rColonias.nativeElement.value,
          'DescripcionEdo': this_aux.descripcionEstado,
          'FechaNacimiento': fechaFormato,
          'NombreCalle': myform1.nomCalleBenef,
          'NumeroCalle': this_aux.RNumeroCalleAlta.nativeElement.value,
          'NumeroDepartamento': this_aux.RNumeroDepartamentoAlta.nativeElement.value,
          'Parentesco': myform1.parentescoBenef,
          'RegistroFederal': myform1.registroFC,
          'CodigoDelegacion': this_aux.codigoDelegacion,
          'CodigoEstado': this_aux.codigoEstado,
          'PorcentajeBenef': this_aux.RPorcentajeAlta.nativeElement.value,
          'Opcion': 'A',
          'FisicaMoral': 'M',
          'NuevaFecha':  myform1.fechaNacBenef,
          'NumeroConsecutiv': this_aux.ultimoRegistroGuardado
          });
      }
      this_aux.contadorAltas = ++this_aux.contadorAltas;
      this_aux.tamRegistrosBenef = this_aux.tamRegistrosBenef + this_aux.contadorAltas;
      console.log('ULTIMOS REGISTROS' + this_aux.ultimoRegistroGuardado);
      this.reiniciarInput();
      this.reiniciarValidaciones(); 
  }

  altaBeneficiariosSoap() {

    const this_aux = this;
    this_aux.BEN.forEach(function(value, key) {
      if (value.Opcion === 'A') {
        if (value.FisicaMoral === 'F') {
          this_aux.capturaDatosAltaBeneficiarioFisico(value.NombreBeneficia.toUpperCase(), value.ApPaternoBenef.toUpperCase(),
          value.ApMaternoBenef.toUpperCase(), value.FechaNacimiento, value.Parentesco.toUpperCase(), value.RegistroFederal.toUpperCase(),
          value.PorcentajeBenef, value.NombreCalle.toUpperCase(), value.NumeroCalle, value.NumeroDepartamento,
          value.DescripcionColonia.toUpperCase(), value.CodigoPostal, value.CodigoDelegacion, value.DescripDelegacion.toUpperCase(),
          value.CodigoEstado, value.DescripcionEdo.toUpperCase());
        } else {
          this_aux.capturaDatosAltaBeneficiarioMoral(
            value.RazonSocial.toUpperCase(), value.FechaNacimiento, value.Parentesco.toUpperCase(), value.RegistroFederal.toUpperCase(),
            value.PorcentajeBenef, value.NombreCalle.toUpperCase(),
            value.NumeroCalle, value.NumeroDepartamento,
            value.DescripcionColonia.toUpperCase(), value.CodigoPostal, value.CodigoDelegacion, value.DescripDelegacion.toUpperCase(),
            value.CodigoEstado, value.DescripcionEdo.toUpperCase()
          );
        }
      }
    });
  }

  capturaDatosAltaBeneficiarioMoral(nomBenRec, fechaFormato,  parenRec, rFcRec, porcenRec, nomCRec, numCRec, 
    numDepRec, descripColoniaRec, codigoPRec, codigoDelRec, descripDelRec, codigoEdoRec, descripEdoRec) {
    const this_aux = this;
    console.log("adentro AltaBeneficiarioMoral");
  
    const THIS: any = this;

    let respuestaAlta: any;

    const formParameters = {
      numeroCuenta: this_aux.numeroCuentaTitular,
      rFCMoral: rFcRec,
      fechaNacimiento: fechaFormato,
      razonSocial: nomBenRec,
      porcentajeBenef: porcenRec,
      nombreCalle: nomCRec,
      numeroCalle: numCRec,
      numeroDepartamento: numDepRec,
      descripcionColonia: descripColoniaRec,
      codigoPostal: codigoPRec,
      codigoDelegacion: codigoDelRec,
      descripcionDelegacion: descripDelRec,
      codigoEstado: codigoEdoRec,
      descripcionEstado: descripEdoRec,
      parentesco: parenRec
    };

    const resourceRequest = new WLResourceRequest(
       'adapters/AdapterBanorteSucursApps/resource/altaMantenimientoBeneficiarioMoral',
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        console.log(response.responseJSON);
        respuestaAlta = response.responseJSON;
        console.log("RESPUESTA ALTA Moral: " + respuestaAlta);
        if (respuestaAlta.Id === "1") {
          const stringDetalleMantenimiento = JSON.stringify(this_aux.DatosJSON);
          this_aux.serviceMantenimiento.detalleMantenimiento = stringDetalleMantenimiento;
          this_aux.A = false;
          this_aux.verificaTransacciones();
          
        } else {
          $('#ModalErrorOperacion').modal('show');
        }
      },
      function(error) {
        THIS.loading = false;
        console.log("Error al dar de alta beneficiario moral");
      }
    );
    console.log("Salió de Response Alta Beneficiario Moral");
  }

  capturaDatosAltaBeneficiarioFisico(nomBenRec, apellPRec, apellMRec, fechaFormato, parenRec, rFcRec, porcenRec,
    nomCRec, numCRec, numDepRec, descripColoniaRec, codigoPRec, codigoDelRec, descripDelRec, codigoEdoRec,
    descripEdoRec) {
    const this_aux = this;
    console.log("adentro AltaBeneficiarioFisico");

    const THIS: any = this;
    let respuestaAltaF: any;
    const formParameters = {
      numeroCuenta: this_aux.numeroCuentaTitular,
      rFCFisica: rFcRec,
      fechaNacimiento: fechaFormato,
      nombreBeneficiario: nomBenRec,
      apellidoPaterno: apellPRec,
      apellidoMaterno: apellMRec,
      porcentajeBenef: porcenRec,
      nombreCalle: nomCRec,
      numeroCalle: numCRec,
      numeroDepartamento: numDepRec,
      descripcionColonia: descripColoniaRec,
      codigoPostal: codigoPRec,
      codigoDelegacion: codigoDelRec,
      descripcionDelegacion: descripDelRec,
      codigoEstado: codigoEdoRec,
      descripcionEstado: descripEdoRec,
      parentesco: parenRec
    };

    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps/resource/altaMantenimientoBeneficiarioFisica',
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        console.log(response.responseJSON);
        respuestaAltaF = response.responseJSON;
        console.log("RESPUESTA ALTA: " + respuestaAltaF);
        if (respuestaAltaF.Id === "1") {
          const stringDetalleMantenimiento = JSON.stringify(this_aux.DatosJSON);
          this_aux.serviceMantenimiento.detalleMantenimiento = stringDetalleMantenimiento;
          this_aux.A = false;
          this_aux.verificaTransacciones();          
        } else {
          $('#ModalErrorOperacion').modal('show');
        }
      },
      function(error) {
        THIS.loading = false;
        console.log("Error al dar de alta beneficiario fisico");
      }
    );
    console.log("Salió de Response Alta Beneficiario Fisico");
  }

  fMSelect(fisicaRec) {
    console.log("Seleccionaste: " + fisicaRec);
    const this_aux = this;
    this_aux.fisicaMoralSeleccionada = fisicaRec;
    if (fisicaRec === "1") {
      console.log("Se elimina rfc");
      const controlrFcMF: FormControl = new FormControl('', 
      Validators.pattern( /^([A-ZÑ&, a-zñ&]{4})(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))([A-Z\d, a-z\d]{2})([A\d])$/
        ) );
      this_aux.myform.setControl('registroFC', controlrFcMF);

      const controlFisicoAp: FormControl = new FormControl(this_aux.RApellidoPatAlta.nativeElement.value, Validators.required);
      const controlFisicoFecha: FormControl = new FormControl(this_aux.RFechaNacimientoAlta.nativeElement.value,  [Validators.required, 
        Validators.pattern(/^\d{4}\-\d{2}\-\d{2}$/)]);
      const controlFisicoPar: FormControl = new FormControl(this_aux.RParentescoAlta.nativeElement.value, Validators.required);
      this_aux.myform.setControl('apPatBenef', controlFisicoAp);
      this_aux.myform.setControl('fechaNacBenef', controlFisicoFecha);
      this_aux.myform.setControl('parentescoBenef', controlFisicoPar);
    } else {
      console.log("Se elimina apellido, fechaN y parentesco");
      const controlrFcMM: FormControl = new FormControl('', [Validators.required, Validators.pattern(
        /^([A-ZÑ&, a-zñ&]{3})(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))([A-Z\d, a-z\d]{2})([A\d])$/
      )]);
      this_aux.myform.setControl('registroFC', controlrFcMM);

      const controlApM: FormControl = new FormControl('');
      const controlFechaM: FormControl = new FormControl('', Validators.pattern(/^\d{4}\-\d{2}\-\d{2}$/));
      const controlParM: FormControl = new FormControl(this_aux.RParentescoAlta.nativeElement.value);      
      this_aux.myform.setControl('apPatBenef', controlApM);
      this_aux.myform.setControl('fechaNacBenef', controlFechaM);
      this_aux.myform.setControl('parentescoBenef', controlParM);   
      this_aux.RApellidoMatAlta.nativeElement.value = "";
    }
     
    const controlNomCalle: FormControl = new FormControl('', Validators.required);
    this_aux.myform.setControl('nomCalleBenef', controlNomCalle);
  }

  fMModificacion() {
    const this_aux = this;
    console.log("Persona: " + this_aux.fisicaMoralSeleccionada);
    if (this_aux.fisicaMoralSeleccionada === "PERSONA FÍSICA") {
      console.log("Se elimina rfc");
      const nombreBen: FormControl = new FormControl(this_aux.nombreBeneficiario, Validators.required);
      this_aux.myform.setControl('nombreBenef', nombreBen);
      const controlrFcMF: FormControl = new FormControl(this_aux.registroFederal,        
        Validators.pattern(/^([A-ZÑ&, a-zñ&]{4})(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))([A-Z\d, a-z\d]{2})([A\d])$/
        ) );
      this_aux.myform.setControl('registroFC', controlrFcMF);

      const controlFisicoAp: FormControl = new FormControl(this_aux.apellidoPat, Validators.required);
      const controlFisicoFecha: FormControl = new FormControl(this_aux.fechaNacimiento, [Validators.required,
        Validators.pattern(/^\d{4}\-\d{2}\-\d{2}$/)]);
      const controlFisicoPar: FormControl = new FormControl(this_aux.parentesco, Validators.required);
      this_aux.myform.setControl('apPatBenef', controlFisicoAp);
      this_aux.myform.setControl('fechaNacBenef', controlFisicoFecha);
      this_aux.myform.setControl('parentescoBenef', controlFisicoPar);
      this_aux.RApellidoMat.nativeElement.value = this_aux.apellidoMat;
    } else {
      console.log("Se elimina apellido, fechaN y parentesco");
      const nombreBen: FormControl = new FormControl(this_aux.razonSocial, Validators.required);
      this_aux.myform.setControl('nombreBenef', nombreBen);
      const controlrFcMM: FormControl = new FormControl(this_aux.registroFederal, [Validators.required, Validators.pattern(
        /^([A-ZÑ&, a-zñ&]{3})(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))([A-Z\d, a-z\d]{2})([A\d])$/
      )]); 
      this_aux.myform.setControl('registroFC', controlrFcMM);


      const controlFisicoFecha: FormControl = new FormControl(this_aux.fechaNacimiento, 
        Validators.pattern(/^\d{4}\-\d{2}\-\d{2}$/));
      this_aux.myform.setControl('fechaNacBenef', controlFisicoFecha);
    }

    const controlNomCalle: FormControl = new FormControl(this_aux.nombreCalle, Validators.required);
    this_aux.myform.setControl('nomCalleBenef', controlNomCalle);
    const codigoP: FormControl = new FormControl(this_aux.codigoPostal, [Validators.required, Validators.minLength(5),
      Validators.maxLength(5)]);
    this_aux.myformCPMod.setControl('CodPBenefMod', codigoP);
    this_aux.RDescripcionEstado.nativeElement.value = this_aux.descripcionEstado;
    this_aux.RDescripcionDelegacion.nativeElement.value = this_aux.descripcionDelegacion;
    this_aux.RColoniasM.nativeElement.value = this_aux.descripcionColonia;
    this_aux.RNumeroCalle.nativeElement.value = this_aux.numeroCalle;
    this_aux.RNumeroDepartamento.nativeElement.value = this_aux.numeroDepartamento;
    this_aux.RPorcentaje.nativeElement.value = this_aux.porcentaje;
  }

  sumaPorcentajes (porcentajeRecibido) {

    if (porcentajeRecibido === 100 ) {
      return true;
    }
    return false;
  }

  consultaCodigoPostalSoap(codigoP) {
    $('#_modal_please_wait').modal('show');
    const this_aux = this;

    console.log("adentro consultar codigo Postal");

    const THIS: any = this;

    this_aux.descripcionColonia = "";
    const formParameters = {
      codigoPostal: codigoP
    };

    const resourceRequest = new WLResourceRequest(
    'adapters/AdapterBanorteSucursApps/resource/consultaCodigoPostal',
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        console.log("CODIGOS POSTALES: " + response.responseJSON);
        this_aux.DatosJSONCP = response.responseJSON;
        this_aux.CP = this_aux.DatosJSONCP.ArrayCP;
        let delegacion: string;
        let estado: string;
        let claveEdo: string;
        let claveDel: string;

        if (this_aux.CP !== undefined) {
          if (this_aux.CP !== "") {
            this_aux.codigoPvacio = 0;
            this_aux.CP.forEach(function(value, key) {
              delegacion = value.Delegacion;
              estado = value.Estado;
              claveEdo = value.ClaveEstado;
              claveDel = value.Delegacionmpio;
            });
            this_aux.descripcionDelegacion = delegacion;
            this_aux.descripcionEstado = estado;
            this_aux.codigoPostal = codigoP;
            this_aux.codigoEstado = claveEdo;
            this_aux.codigoDelegacion = claveDel;
          } else {
            this_aux.CP = null;
            this_aux.codigoPvacio = 1;
            this_aux.descripcionDelegacion = "";
            this_aux.descripcionEstado = "";
            this_aux.codigoPostal = "";
            this_aux.codigoEstado = "";
            this_aux.codigoDelegacion = "";
            this.descripcionColonia = "";
          }
          
        } else {
          $('#errorModal').modal('show');
        }
        $('#_modal_please_wait').modal('hide');
      },
      function(error) {
        THIS.loading = false;
        $('#_modal_please_wait').modal('hide');
        console.log("Error al consultar CP");
      }
    );
    console.log("Salió de Response Consultar CP");
  }

  seleccionColonia() {
    const this_aux = this;
    this_aux.descripcionColonia = this_aux.rColonias.nativeElement.value;
  }

  guardarModificacionesView( myform, myformCPM) {
    const this_aux = this;
    const THIS: any = this;
    $('#modalModificacionBeneficiarios').modal('toggle');
    let patron = /-/g;
    let fechaFormato: any = "";
    if ( myform.fechaNacBenef !== null ) {
      fechaFormato = myform.fechaNacBenef.replace(patron, "");
    }

    let encontrar: any = "";

    if (this_aux.opcion !== 'A') {
      encontrar = this_aux.contadorModificaciones.find(function(element) {
        return element === this_aux.consecutivoSeleccionado;
      });
  
      if (encontrar === undefined) {
        this_aux.contadorModificaciones.push(this_aux.consecutivoSeleccionado);
      }
    }
    

    this_aux.BEN.forEach(function(value, key) {
      if (this_aux.consecutivoSeleccionado === value.NumeroConsecutiv) {
        value.CodigoPostal = myformCPM.CodPBenefMod;
        value.DescripDelegacion = this_aux.descripcionDelegacion;
        value.DescripcionColonia = this_aux.RColoniasM.nativeElement.value;
        value.DescripcionEdo = this_aux.descripcionEstado;
        value.FechaNacimiento = fechaFormato;
        value.NuevaFecha = myform.fechaNacBenef;
        value.NombreCalle = myform.nomCalleBenef;
        value.NumeroCalle = this_aux.RNumeroCalle.nativeElement.value;
        value.NumeroDepartamen = this_aux.RNumeroDepartamento.nativeElement.value;
        value.Parentesco = myform.parentescoBenef;
        value.PorcentajeBenef = this_aux.RPorcentaje.nativeElement.value;
        value.RegistroFederal = myform.registroFC;
        value.CodigoDelegacion = this_aux.codigoDelegacion;
        value.CodigoEstado = this_aux.codigoEstado;

        if (value.FisicaMoral === "F") {
          value.NombreBeneficia =  myform.nombreBenef;
          value.ApPaternoBenef =  myform.apPatBenef;
          value.ApMaternoBenef = this_aux.RApellidoMat.nativeElement.value;
        } else {
          value.RazonSocial =  myform.nombreBenef;
        }
      }
    });
    
    this.reiniciarInput();
    this.reiniciarValidaciones();
  }

  guardarCambios() {
    const this_aux = this;
    console.log("numero de modificaciones:" + this_aux.contadorModificaciones.length);
    let rFCModif: any = "";
    let fisicaMoralModif: any = "";
    let fechaNacimientoModif: any = "";
    let nombreBeneficiarioModif: any = "";
    let razonSocialModif: any = "";
    let apellidoPatModif: any = "";
    let apellidoMatModif: any = "";
    let porcentajeModif: any = "";
    let nombreCalleModif: any = "";
    let numeroCalleModif: any = "";
    let numeroDepartamentoModif: any = "";
    let descripcionColoniaModif: any = "";
    let codigoPostalModif: any = "";
    let codigoDelegacionModif: any = "";
    let descripcionDelegacionModif = "";
    let codigoEstadoModif: any = "";
    let descripcionEstadoModif: any = "";
    let parentescoModif: any = "";
    let consecutivoModifi: any = "";

    let encontrar: any = "";
    if (this_aux.contadorModificaciones.length !== 0) {
        this_aux.BEN.forEach(function(value, key) {
          encontrar = this_aux.contadorModificaciones.find(function(element) {
            return element === value.NumeroConsecutiv;
          });
          if (encontrar !== undefined) {
            console.log("Valor modificado: " + value.NumeroConsecutiv);
            codigoPostalModif = value.CodigoPostal;
            codigoDelegacionModif = value.CodigoDelegacion;
            codigoEstadoModif = value.CodigoEstado;
            descripcionDelegacionModif = value.DescripDelegacion.toUpperCase();
            descripcionColoniaModif = value.DescripcionColonia.toUpperCase();
            descripcionEstadoModif = value.DescripcionEdo.toUpperCase();
            fechaNacimientoModif = value.FechaNacimiento;
            nombreCalleModif = value.NombreCalle.toUpperCase();
            numeroCalleModif = value.NumeroCalle;
            numeroDepartamentoModif = value.NumeroDepartamen;
            parentescoModif = value.Parentesco.toUpperCase();
            porcentajeModif = value.PorcentajeBenef;
            rFCModif = value.RegistroFederal.toUpperCase();
            fisicaMoralModif = value.FisicaMoral;
            consecutivoModifi = value.NumeroConsecutiv;

            if (value.FisicaMoral === "F") {
              nombreBeneficiarioModif = value.NombreBeneficia.toUpperCase();
              apellidoPatModif = value.ApPaternoBenef.toUpperCase();
              apellidoMatModif = value.ApMaternoBenef.toUpperCase();
            } else {
              razonSocialModif = value.RazonSocial.toUpperCase();
            }
            
            this_aux.modificarBeneficiariosSoap(consecutivoModifi, nombreBeneficiarioModif, apellidoPatModif,
              apellidoMatModif, rFCModif, fisicaMoralModif, razonSocialModif, codigoPostalModif,
              codigoDelegacionModif, codigoEstadoModif, descripcionDelegacionModif, descripcionColoniaModif,
              descripcionEstadoModif, fechaNacimientoModif,  nombreCalleModif, numeroCalleModif,
              numeroDepartamentoModif, parentescoModif, porcentajeModif);
          }
        });
    }
  }

  modificarBeneficiariosSoap(consecutvoModif, nombreBeneficiarioModif, apellidoPatModif, apellidoMatModif, rFCModif,
    fisicaMoralModif, razonSocialModif, codigoPostalModif, codigoDelegacionModif, codigoEstadoModif,
    descripcionDelegacionModif, descripcionColoniaModif, descripcionEstadoModif, fechaNacimientoModif,
    nombreCalleModif, numeroCalleModif, numeroDepartamentoModif, parentescoModif, porcentajeModif) {
    const this_aux = this;
    const THIS: any = this;
    let respuestaModif: any;
    console.log("adentro modificar Beneficiarios");
    console.log(this_aux.BEN);
    if ( numeroDepartamentoModif === "") {
      numeroDepartamentoModif = "0";
    }
    if (fechaNacimientoModif === "") {
      fechaNacimientoModif = "19000101";
    }

    const formParameters = {
      numeroCuenta: this_aux.numeroCuentaTitular,
      numeroConsecutivoM: consecutvoModif,
      nombreBenM: nombreBeneficiarioModif,
      apellidoPatM: apellidoPatModif,
      apellidoMatM: apellidoMatModif,
      rFCM: rFCModif,
      fisicaMorM: fisicaMoralModif,
      razonSocM: razonSocialModif,
      CodigoPM: codigoPostalModif,
      codigoDelM: codigoDelegacionModif,
      codigoEdoM: codigoEstadoModif,
      descDeleM: descripcionDelegacionModif,
      descColM: descripcionColoniaModif,
      descEdoM: descripcionEstadoModif,
      fechaNacM: fechaNacimientoModif,
      nombreCalleM: nombreCalleModif,
      numeroCalleM: numeroCalleModif,
      numeroDepM: numeroDepartamentoModif,
      parentescoM: parentescoModif,
      porcentajeM: porcentajeModif
    };

    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps/resource/modificarBeneficiarios',
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        console.log(response.responseJSON);
        this_aux.DatosJSON = response.responseJSON;

        respuestaModif = response.responseJSON;
        console.log("RESPUESTA MODIFICACION: " + respuestaModif);
        if (respuestaModif.Id === "1") {
          const stringDetalleMantenimiento = JSON.stringify(this_aux.DatosJSON);
          this_aux.serviceMantenimiento.detalleMantenimiento = stringDetalleMantenimiento;
          this_aux.C = false;
          this_aux.verificaTransacciones();
          
        } else {
          $('#ModalErrorOperacion').modal('show');
        }
        
      },
      function(error) {
        THIS.loading = false;
        console.log("Error al modificar beneficiarios");
      }
    );

    console.log("Salió de Response Modificar Beneficiarios");
  }

  finalizaProcesoGuardarDatos() {
    const this_aux = this;
    let totalPorcentaje: any = 0;
    let porcentajeVacio: any = true;
    this_aux.porcentajeGuardado = 0;
     let conversion: any = 0;
     console.log("PORCENTAJE Benefe: " + this.BEN);
     this.BEN.forEach(function(value, key) {
       if ( value.PorcentajeBenef === "") {
          porcentajeVacio = false;
       }
      conversion = Number(value.PorcentajeBenef);
      this_aux.porcentajeGuardado = this_aux.porcentajeGuardado + conversion;
    });
    console.log("PORCENTAJE GUARDADO: " + this_aux.porcentajeGuardado);
    
    if (this_aux.sumaPorcentajes(this_aux.porcentajeGuardado) && porcentajeVacio) {
      this._validaNipService.validaNipTrans();

      $('#ModalTDDLogin').modal('show');

      let res;
  
      this._validaNipService.validarDatosrespuesta().then(
        mensaje => {
  
          res = this._validaNipService.respuestaNip.res;
          console.log(res);
  
          if (res === true) {  
            $('#ModalTDDLogin').modal('hide');
            this_aux.verificaServicios();
          } else {
            console.error("Mostrar modal las tarjetas no son iguales");
          }
        }
      );    
    } else {
      this_aux.abrirModalPorcentaje();
    }  
  }

  verificaServicios() {
    const this_aux = this;
    let procesoFinalizado: any = 0;
    this_aux.A = false;
    this_aux.B = false;
    this_aux.C = false;

    if (this_aux.contadorModificaciones.length !== 0) {
      this_aux.C = true;
    }
    if (this_aux.contadorAltas !== 0) {
      this_aux.A = true;
    } 
    if (this_aux.arrayBajas.length !== 0) {
      this_aux.B = true;
    }

    this_aux.realizaAccion();
  }

  realizaAccion() {
    const this_aux = this;
    if ( this_aux.A ) { 
         this_aux.altaBeneficiariosSoap();
    } else {
        if (this_aux.B) {
          this_aux.bajaBeneficiarios();
        } else {
              
          if (this_aux.C) {
             this_aux.guardarCambios();
          }
        }
    }
  }

  verificaTransacciones() {
    const this_aux = this;
    if ( this_aux.B === false && this_aux.C === false && this_aux.A === false ) {      
      $('#_modal_please_wait').modal('show');
      this_aux.router.navigate(['/detalleBeneficiarios']);

    } else {
        this_aux.realizaAccion();
    }
  }
}
