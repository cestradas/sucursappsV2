import { Component, OnInit } from '@angular/core';
import { SesionBxiService } from '../../sesion-bxi.service';
import { OperacionesBXI } from '../../operacionesBXI';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-cancelar-envio-edc',
  templateUrl: './cancelar-envio-edc.component.html'
})
export class CancelarEnvioEdcComponent implements OnInit {

  botonAceptar: any = 0;
  botonTerminos: any = 0;
  constructor(private router: Router, private service: SesionBxiService) { }

  aliasCuenta: string;
  terminacionTarjeta: string;
  ngOnInit() {
    this.aliasCuenta = this.service.aliasCuentaEDCSel;
    let tamanio = this.service.numeroCuentaEDCSel.length;
    this.terminacionTarjeta = this.service.numeroCuentaEDCSel.substring(tamanio - 4, tamanio);
    this.validarCorreo(this.service.EmailCliente);
  }

  validarCorreo (email) {
    if (email === undefined) {
      $('#registraCorreo').modal('show');
      let btnContinuar = document.getElementById('continuarCancelacion');
      btnContinuar.style.display = 'none';
    }
  }


  checkBox(id) {
    const this_aux = this;
    let imagenAcept = document.getElementById("imageAcept");
    let imagenTerminos = document.getElementById("imageTerminos");

    if (id === 1) {
      if (this_aux.botonAceptar === 0) {
        imagenAcept.setAttribute("src", "./assets/img/cancelacionEDCselected.png");
        this_aux.botonAceptar = 1;
      } else {
        imagenAcept.setAttribute("src", "./assets/img/cancelacionEDC.png");
        this_aux.botonAceptar = 0;
      }
    } else {
      if (this_aux.botonTerminos === 0) {
        imagenTerminos.setAttribute("src", "./assets/img/cancelacionEDCselected.png");
        this_aux.botonTerminos = 1;
      } else {
        imagenTerminos.setAttribute("src", "./assets/img/cancelacionEDC.png");
        this_aux.botonTerminos = 0;
      }
    }    
  }

  mostrarTerminos () {
    $('#modalTerminos').modal('show');
  }

  activarCancelacion() {
    $('#_modal_please_wait').modal('show');
    const this_aux = this;
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    let opcion = "";

    if (this_aux.service.opcionEDCSel === "1") {
      opcion = "3";
    } else {
      opcion = "4";
    }
    operacionesbxi.mantenimientoCancelacionEDC(opcion, 'A', this_aux.service.numeroCuentaEDCSel).then(
      function(response) {        
        setTimeout(function() { 
          const detalleMant = response.responseJSON;
          if (detalleMant.Id === "1") {
          this_aux.router.navigate(['/cancelarEnvioEDC_DomicilioFinish']);
          } else {
            setTimeout(function() {
              $("#_modal_please_wait").modal("hide");
              this_aux.showErrorSucces(detalleMant);
            }, 500);
          }
          $('#_modal_please_wait').modal('hide');
       }, 3000); 
      },
        function(error) {
          $('#_modal_please_wait').modal('hide');
          console.error("Error");
          this_aux.showErrorPromise(error);
        });
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
    document.getElementById('msgError').innerHTML =   "No fue posible confirmar la operación. Por favor verifica tus datos.";
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
