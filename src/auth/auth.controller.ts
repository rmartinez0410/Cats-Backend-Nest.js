import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
import { Role } from '../common/enums/rol.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/activate-user.decorator';
import type { UserActiveInterface } from '../common/interface/user-active.interface';

interface RequestWithUser extends Request {
  user: { email: string; role: string };
}

@Controller('auth')

export class AuthController {
    constructor(
        private readonly authServices: AuthService,   
    ){}

    @Post('register')
    register(
        @Body() 
        registerDto:RegisterDto
    ){
        return this.authServices.register(registerDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(
        @Body() 
        loginDto: LoginDto 
    ){
        return this.authServices.login(loginDto);
    };

    @Get('profile')
    @Auth(Role.Admin)
    
    profile( 
       @Request() req: RequestWithUser,
       @ActiveUser() user: UserActiveInterface,
    ){
      return this.authServices.profile(user);  
    }

} 
