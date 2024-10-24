import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-jwt'
import { AuthService } from "./auth.service";
import { UsersService } from "src/users/services/users.service";
import { User } from "src/users/entities/user.entity";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {
    super({
      jwtFromRequest: authService.returnJwtExtractor(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    })
  }
  async validate(payload): Promise<User> {
    const { email } = payload
    return this.userService.validateUser(email)
  }
}