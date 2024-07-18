import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public normalize(str: string): string {
    return str.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  public removeUndefineds(obj: any) {
    Object.keys({ ...obj })
      .forEach((key) => {
        if (!obj[key]) {
          delete obj[key];
        }
      });
    return obj;
  }

}
