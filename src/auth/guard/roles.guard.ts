import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles, ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../common/enums/rol.enum';




@Injectable()
export class RolesGuard implements CanActivate {

  constructor( 
    private readonly reflector: Reflector

  ){}

  canActivate(context: ExecutionContext,): boolean{
    const role = this.reflector.getAllAndOverride<Role>(
      ROLES_KEY,
      [context.getHandler(),
       context.getClass() 
      ]);

      if(!role){
        return true;
      }

      console.log(role);

     
      const {user} = context.switchToHttp().getRequest();

       console.log('user.role:', user?.role)
       console.log('required role:', role)

      if(user?.role === Role.Admin) return true;


    return user?.role === role;
  }
}
