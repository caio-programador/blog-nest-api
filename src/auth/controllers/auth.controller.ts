import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { LoginDto } from "../dto/login.dto";
import { AuthService } from "../services/auth.service";
import { JwtResponse } from "../dto/jwt-response";

@Controller('auth')
export class AuthController{ 

  constructor(private readonly authService: AuthService) { }
  
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<JwtResponse> {
    return this.authService.login(loginDto)
  }
}
