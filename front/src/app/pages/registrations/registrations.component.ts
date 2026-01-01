import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'registrations',
    imports: [MatCardModule, RouterLink],
    templateUrl: './registrations.component.html',
    styleUrl: './registrations.component.scss'
})
export class RegistrationsComponent {

  public registrations: IRegistration[] = [
    {
      title: 'Usuários',
      subtitle: 'Administradores, funcionários, clientes, etc.',
      img: 'assets/users.svg',
      link: '/users'
    },
    {
      title: 'Sub-serviços',
      subtitle: 'Soldas, fretes, corridas, etc. ',
      img: 'assets/subservices.svg',
      link: '/subservices'
    },
  ]

}

interface IRegistration {
  title: string,
  subtitle: string,
  img: string,
  link: string,
}
