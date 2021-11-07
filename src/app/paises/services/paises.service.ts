import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseUrl:string = 'https://restcountries.com/v3.1';
  private _regiones:string[] = [ 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania' ];

  get regiones():string[]{
    return [ ...this._regiones ]
  }

  constructor( private http:HttpClient ) { }

  getPaisesPorRegion( region:string ):Observable<PaisSmall[]>{

    const url:string=`${this.baseUrl}/region/${ region }?fields=name&fields=cca2`;
    return this.http.get<PaisSmall[]>( url );

  }

  getPaisPorCodigo(codigo:string):Observable<Pais | null>{

    if ( !codigo ) {
      return of( null )
    }
    console.log('codigo:', codigo);
    
    const url:string = `${this.baseUrl}/alpha/${ codigo }`;
    return this.http.get<Pais | null>( url ).pipe(
      map( (data:any )=>{
        return data[0]
      } )
    )

  }

  getPaisPorCodigoSmall(codigo:string):Observable<PaisSmall>{

    const url:string = `${this.baseUrl}/alpha/${ codigo }?fields=name&fields=cca2`;
    return this.http.get<PaisSmall>( url ).pipe(
      map( (data:any )=>{
        return data[0]
      } )
    )

  }

  getpaisesporCodigoBorders( borders: string[] ):Observable<PaisSmall[]>{
    if ( !borders ) {
      return of( [] );
    }

    const peticiones: Observable<PaisSmall>[] = []
    borders.forEach(codigo => {
      const peticion = this.getPaisPorCodigoSmall( codigo );
      peticiones.push( peticion );
    });
    return combineLatest( peticiones );
  }
}
