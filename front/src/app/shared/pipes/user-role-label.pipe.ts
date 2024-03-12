import { Pipe, PipeTransform } from '@angular/core';
import { USER_ROLES_OPTIONS, UserRole } from '../models/User';

@Pipe({
  name: 'userRoleLabel',
  standalone: true
})
export class UserRoleLabelPipe implements PipeTransform {

  transform(roles: UserRole[] | UserRole): string {
    if (typeof roles === 'string') {
      roles = [roles];
    }
    return roles?.map(role => USER_ROLES_OPTIONS.find(opt => opt.value === role)?.label).join(' - ');
  }

}
