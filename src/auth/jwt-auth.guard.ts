import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class MyAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    console.log('handle request user:', user);

    return user;
  }
}
