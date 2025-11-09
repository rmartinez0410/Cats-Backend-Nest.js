import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../constants/jwt.constants';


@Injectable()
export class AuthGuard implements CanActivate {

constructor(

  private readonly jwtService: JwtService

){}

  async canActivate(context: ExecutionContext,): Promise<boolean>  {
    
    const request = context.switchToHttp().getRequest();
    
    const token = this.extractTokenFromHeader(request);
    
    console.log(token)
    
    if(!token){
      throw new UnauthorizedException("Token incorrecto}");
    }

    try{
      const payload = await this.jwtService.verifyAsync(token);
      console.log(payload)
      request.user = payload;
      
    }catch(error){
      throw new UnauthorizedException(error);
    }
    
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token]  = request.headers.authorization?.split(" ") ?? [];
    
    if( type === 'Bearer' && token != ""){
      return token
    }

    return undefined;
  }



}
 