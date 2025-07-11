import { 
  Controller, 
  Get, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  ParseUUIDPipe,
  ForbiddenException,
  Post,
  Query
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateSnsAccountDto } from './dto/create-sns-account.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(req.user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteProfile(@Request() req, @Body('currentPassword') currentPassword: string) {
    return this.usersService.deleteUser(req.user.id, currentPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/sns')
  async addSnsAccount(@Request() req, @Body() createSnsAccountDto: CreateSnsAccountDto) {
    return this.usersService.addSnsAccount(
      req.user.id,
      createSnsAccountDto.snsType,
      createSnsAccountDto.snsUrl
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/sns/:id')
  async deleteSnsAccount(@Request() req, @Param('id') snsAccountId: string) {
    return this.usersService.deleteSnsAccount(req.user.id, +snsAccountId);
  }

  // 관리자용 API

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async getAllUsers(@Query('skip') skip = '0', @Query('take') take = '10') {
    return this.usersService.getAllUsers(+skip, +take);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id/status')
  async updateUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: 'ACTIVE' | 'DORMANT' | 'BANNED',
  ) {
    return this.usersService.updateUserStatus(id, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
