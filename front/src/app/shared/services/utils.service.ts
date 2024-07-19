import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public normalize(str: string): string {
    return str.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  public removeUndefineds(obj: any) {
    if (!obj) return {};
    Object.keys({ ...obj })
      .forEach((key) => {
        if (obj[key] === undefined || obj[key] === null) {
          delete obj[key];
        }
      });
    return obj;
  }

}
