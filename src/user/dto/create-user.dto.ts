export class CreateUserDto {
    readonly userId?: string;
              username: string;
             firstName: string;
             lastName: string;
    readonly password: string;
    readonly roles: string[];
    readonly email: string;
    readonly phoneNumber: string;
  }
  