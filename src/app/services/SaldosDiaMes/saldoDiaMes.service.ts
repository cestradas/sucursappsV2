import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';


@Injectable()
export class SaldosDiaMesService {

    datosSaldo: DatosSaldos = {

        saldoTotalDia: 7000,
        saldoTotalMes: 15000,
        saldoRestaDia: 0,
        saldoRestaMes: 0

    };

    constructor() {

        this.cargarSaldosDia();

    }

    cargarSaldosDia() {

        if (localStorage.getItem('saldoTotalDia')) {

            console.log("Saldo Dia LS: ", localStorage.getItem('saldoTotalDia'));
            this.datosSaldo.saldoTotalDia = Number(localStorage.getItem('saldoTotalDia'));

        } else {

            console.log("El saldo no ha sido modificado: ", this.datosSaldo.saldoTotalDia);

        }

    }

    modificarSaldioDia(saldo: number) {

        this.datosSaldo.saldoTotalDia -= saldo;
        this.guadrarSaldoDia(this.datosSaldo.saldoTotalDia);


    }

    guadrarSaldoDia (saldo: number) {

        console.log("Guardando Saldo Total Dia");
        localStorage.setItem('saldoTtlDia', String(saldo));

    }

}

interface DatosSaldos {

    saldoTotalDia: number;
    saldoTotalMes: number;
    saldoRestaDia: number;
    saldoRestaMes: number;

}
