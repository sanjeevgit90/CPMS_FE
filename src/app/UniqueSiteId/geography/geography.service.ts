import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class GeographyService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 
  
  saveGeography(body, header, flag) {
    if (flag == 'save') {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/geograpghy';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/geograpghy';
      return this._http.put(url , body, {headers: header});
      }
  }

  getGeographyList(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/geograpghy/geographyByFilter';
    return this._http.post(url , body, {headers: header});
}

GeoById(name, state, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/geograpghy/'+name+'/'+state;
  return this._http.get(url, { headers: header });
}

deleteGeographyByid(name, state, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/geograpghy/'+name+'/' +state;
  return this._http.delete(url, { headers: header });
}


}
