import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
declare var $: $;

@Component({
  selector: 'app-final',
  templateUrl: './final.component.html'
})
export class FinalComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

    const this_aux = this; 
    let navElement = document.getElementById("navBar");
    navElement.classList.remove("nav-img-banorte-preferente");
    navElement.classList.add("nav-img-banorte");
    $('.modal').removeClass('show');
    $('#_modal_please_wait').modal('hide');
    $('div').removeClass('modal-backdrop');
    setTimeout( function() {
      this_aux.router.navigate(['/login']);  
      location.reload();
    } 
    , 3000);
    
  }

}
