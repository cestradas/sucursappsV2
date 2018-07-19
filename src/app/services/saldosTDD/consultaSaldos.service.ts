import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import $ from 'jquery';
declare var $: $;

@Injectable()
export class ConsultaSaldosTddService {

    datosSaldosTDD: DatosSaldosTDD = {

        Id: '', 
        NumeroCuenta: '',
        ClabeCuenta: '',
        SaldoDia: '',
        SaldoDisponible: '',
        SaldoRetenido: '',
        SaldoMesAnterior: ''

    };

    constructor() {}

    showErrorSucces(json) {

        console.log(json.Id + json.MensajeAUsuario);
        if (json.Id === '2') {
          document.getElementById('mnsError').innerHTML =   'El servicio no esta disponible, favor de intentar mas tarde';
        } else {
          document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
        }
        $('#errorModal').modal('show');
    }

      showErrorPromise(error) {
        $('#errorModal').modal('show');
        if (error.errorCode === 'API_INVOCATION_FAILURE') {
            document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
        } else {
          document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
        }
    }

    cargarSaldosTDD() {

        const THIS: any = this;
        const this_aux = this;
        const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursApps/resource/consultaClabesSaldos',
            WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        resourceRequest
            .send()
            .then(
                function(response) {
                  
                    let resp = response.responseJSON;
                    if (resp.Id === '1' ) {
                    THIS.datosSaldosTDD.Id = resp.Id;
                    THIS.datosSaldosTDD.NumeroCuenta = resp.NumeroCuenta;
                    THIS.datosSaldosTDD.ClabeCuenta = resp.ClabeCuenta;
                    THIS.datosSaldosTDD.SaldoDia = resp.SaldoDia;
                    THIS.datosSaldosTDD.SaldoDisponible = resp.SaldoDisponible;
                    THIS.datosSaldosTDD.SaldoRetenido = resp.SaldoRetenido;
                    THIS.datosSaldosTDD.SaldoMesAnterior = resp.SaldoMesAnterior;
                    }  else {
                        this_aux.showErrorSucces(resp);
                    }
                } ,

                function(error) {
                    this_aux.showErrorSucces(error);
                    console.log(error.responseText);
        
                });

            }

            validarDatosSaldoTdd(): Promise<any> {
                return new Promise( (resolve, reject) => {

                    let intervalo = setInterval( () => {
            
                        if ( this.datosSaldosTDD.Id !== '' && this.datosSaldosTDD.NumeroCuenta !== '' &&
                             this.datosSaldosTDD.ClabeCuenta !== '' && this.datosSaldosTDD.SaldoDia !== '' &&
                             this.datosSaldosTDD.SaldoDisponible !== '' && this.datosSaldosTDD.SaldoRetenido !== '' &&
                             this.datosSaldosTDD.SaldoMesAnterior !== '') {

                            let resp = {

                                'Id': this.datosSaldosTDD.Id,
                                'NumeroCuenta': this.datosSaldosTDD.NumeroCuenta,
                                'ClabeCuenta': this.datosSaldosTDD.ClabeCuenta,
                                'SaldoDia': this.datosSaldosTDD.SaldoDia,
                                'SaldoDisponible': this.datosSaldosTDD.SaldoDisponible,
                                'SaldoRetenido': this.datosSaldosTDD.SaldoRetenido,
                                'SaldoMesAnterior': this.datosSaldosTDD.SaldoMesAnterior

                            };
                
                            resolve(resp);

                            clearInterval(intervalo);
                
                        }
                
                      }, 1000);
                });

                

            }

            validaDatosSaldo(): Observable<any> {
    
                return new Observable( observer => {
            
                  let intervalo = setInterval( () => {
            
                    observer.next( this.datosSaldosTDD.SaldoDisponible );
                    observer.next( this.datosSaldosTDD.NumeroCuenta );
            
                  });
            
                }).filter( ( valor, index ) => {
            
                    if (valor !== '') {
                      
                      return true;  
                      
                    }
            
                });
              }
            
              validaDatosNumCuenta(): Observable<any> {
                
                return new Observable( observer => {
            
                //   let intervalo = setInterval( () => {
            
                    observer.next( this.datosSaldosTDD.NumeroCuenta );
            
                //   });
            
                }).filter( ( valor, index ) => {
            
                    if (valor !== '') {
                      
                      return true;  
                      
                    }
            
                });
              }

}



interface DatosSaldosTDD {

    Id: string; 
    NumeroCuenta: string;
    ClabeCuenta: string;
    SaldoDia: string;
    SaldoDisponible: string;
    SaldoRetenido: string;
    SaldoMesAnterior: string;

}
