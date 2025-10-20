import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { ActiveUser } from '../common/decorators/activate-user.decorator';
import type { UserActiveInterface } from 'src/common/interface/user-active.interface';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enums/rol.enum';

@Auth(Role.User)


@Controller('cats')

export class CatsController {

  constructor(
    private readonly catsService: CatsService,
  
  ) {}

  @Post()
  async create(
    @Body() createCatDto: CreateCatDto,
    @ActiveUser()user: UserActiveInterface,
  ){
    
    return this.catsService.create(createCatDto, user);
  }

  @Get()
  async findAll(
    @ActiveUser() user: UserActiveInterface, 
  ){
    return await this.catsService.findAll(user);
  }

  @Get(':id' )
  async findOne(
    @Param('id') id: number,
    @ActiveUser() user: UserActiveInterface,
  ) {//los parametros vienen en string pero con el class validator se convierte en number 
    
    return this.catsService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCatDto: UpdateCatDto,
    @ActiveUser() user: UserActiveInterface,
  ){

    return this.catsService.update(id, updateCatDto, user);

  }

  @Delete(':id')
  async remove(
    @Param('id') id: number, 
    @ActiveUser() user: UserActiveInterface,
  ){
    return this.catsService.remove( id ,user);
  }
}
