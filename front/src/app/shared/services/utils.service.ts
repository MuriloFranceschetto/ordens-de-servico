import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public normalize(str: string): string {
    return str.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

}
