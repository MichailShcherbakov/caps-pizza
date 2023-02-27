import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard as PasswordGuard } from "@nestjs/passport";

@Injectable()
class Guard extends PasswordGuard("jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException(`The authentication fails`);
    }

    return user;
  }
}

export const AuthGuard = () => UseGuards(Guard);
export default AuthGuard;
