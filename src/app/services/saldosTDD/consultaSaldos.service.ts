import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';


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

    constructor(@Inject(DOCUMENT) private _document) {

        this.cargarSaldosTDD();

    }

    cargarSaldosTDD() {

        const THIS: any = this;

        const formParameters = {
        
            txtTipoMov: '1',
            txtNumCuenta: '0202379371'

          };

        const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursApps/resource/consultaClabesSaldos',
            WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        resourceRequest
            .sendFormParameters(formParameters)
            .then(
                function(response) {
                  
                    let resp = response.responseJSON;

                    THIS.datosSaldosTDD.Id = resp.Id;
                    THIS.datosSaldosTDD.NumeroCuenta = resp.NumeroCuenta;
                    THIS.datosSaldosTDD.ClabeCuenta = resp.ClabeCuenta;
                    THIS.datosSaldosTDD.SaldoDia = resp.SaldoDia;
                    THIS.datosSaldosTDD.SaldoDisponible = resp.SaldoDisponible;
                    THIS.datosSaldosTDD.SaldoRetenido = resp.SaldoRetenido;
                    THIS.datosSaldosTDD.SaldoMesAnterior = resp.SaldoMesAnterior;
        
                } ,

                function(error) {
        
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
