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
    setTimeout( function() {
      
  
      localStorage.removeItem("contadorTime");
      this_aux.router.navigate(['/login']);
    } 
    , 3000);
    
  }

}
