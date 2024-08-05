import { Controller, Get, Post, Body, Put, Request, UseGuards, Logger, Delete, Param, NotFoundException, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtRefreshGuard } from '../auth/jwt-refresh.guard';

@Controller('api/v1/users')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    this.logger.debug(`UserDto ==> ${JSON.stringify(createUserDto)}`);
    return this.userService.create(createUserDto);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }

  @Post('refresh-token')
  async genRefreshToken(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new Error('Invalid authorization header format');
    }

    return this.authService.refreshToken(token);
  }


  @UseGuards(JwtAuthGuard)
  @Get('points')
  async getPoints(@Request() req) {
    const user = await this.userService.findOneById(req.user.sub);
    return { points: user.points };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    this.logger.debug(`Profile request ==> ${JSON.stringify(req.user)}`);
    const user = await this.userService.findOneById(req.user.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...profile } = user;
    console.log('profile ==>',user);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile/update')
  async updateProfile(@Request() req, @Body() updateData: any) {
    this.logger.debug(`Profile request ===> ${req.user}`);
    return this.userService.updateProfile(req.user.sub, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deleteUserById(@Param('id') userId: string) {
    this.logger.debug(`Deleting user with ID: ${userId}`);
    return this.userService.deleteUserById(userId);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteAllUsers() {
    this.logger.debug('Deleting all users');
    return this.userService.deleteAllUsers();
  }
  // Other endpoints...
}
