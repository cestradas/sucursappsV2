import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

    setTimeout( function() {
      this_aux.router.navigate(['/login']);
    } 
    , 3000);
    
  }

}
