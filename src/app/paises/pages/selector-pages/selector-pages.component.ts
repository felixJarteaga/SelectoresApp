import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { pipe } from 'rxjs';

import { switchMap, tap } from 'rxjs/operators';

import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-pages',
  templateUrl: './selector-pages.component.html',
  styles: [
  ]
})
export class SelectorPagesComponent implements OnInit {

  miFormulario:FormGroup = this.fb.group({
    region: ['', Validators.required ],
    pais: ['', Validators.required ],
    frontera: [ '', Validators.required ]

  })

  // Llenar selectores
  regiones:string[]=[];
  paises:PaisSmall[]=[];
  // fronteras:string[]=[];
  fronteras:PaisSmall[]=[];


  // UI
  cargando:boolean = false;

  constructor( private fb:FormBuilder, private paisesServices:PaisesService ) { }

  ngOnInit(): void {

    this.regiones = this.paisesServices.regiones;

    //Cuando cambie la region

    // this.miFormulario.get('region')?.valueChanges
    //   .subscribe( region => {
    //     console.log(region);
        
    //     this.paisesServices.getPaisesPorRegion( region )
    //       .subscribe( paises => {
    //         this.paises = paises;
    //       } );

    //   } );
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( ( _ ) =>{
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        } ),
        switchMap( region => this.paisesServices.getPaisesPorRegion( region ) )
      )
      .subscribe( paises => {
        this.paises = paises;
        this.cargando = false;
      } );

      // Cuando cambia el pais
      this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap( ( _ ) =>{
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        } ),
          switchMap( codigo => this.paisesServices.getPaisPorCodigo( codigo ) ),
          switchMap( pais => this.paisesServices.getpaisesporCodigoBorders( pais?.borders! ) )
        )
        .subscribe( paises => {
          // this.fronteras = pais?.borders || [] ;
          console.log(paises);
          
          this.cargando = false;
        } );

  }

  guardar(){
    console.log(this.miFormulario.value);
    
  }

}
