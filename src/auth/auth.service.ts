import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './login.dto';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {


    constructor(
        private readonly userService: UsersService,
        private readonly  jwtService: JwtService
    ){}
    
    async register({name, email, password}: RegisterDto){

        const user = await this.userService.FindOneByEmail(email);

        if (user){
            throw new BadRequestException('User exist')
        }

        await this.userService.create({ 
            name,
            email, 
            password: await bcryptjs.hash(password, 10),
         })
        
        return {
            name,
            email,
            message: "user created successfully"
        } 
    }
            
    async login( {email, password}: LoginDto ){

        const user = await this.userService.findByEmailWhitPassword(email);
        
        if(!user){
            throw new UnauthorizedException('email is wrong')
        }

        const IsPasswordValid = await bcryptjs.compare(password, user.password)
        
        if(!IsPasswordValid){
            throw new UnauthorizedException('password is wrong');
        }

        const payload = {email: user.email , role: user.role};

        const token = await this.jwtService.signAsync(payload);

        return {
            token,
            email
        };     
    }

    async profile({email , role }:{email:string, role: string}){
       
        if( role !== 'admin'){

            throw new UnauthorizedException('User not authorized in this rute');

        }

       return await this.userService.FindOneByEmail(email);

    }
}
