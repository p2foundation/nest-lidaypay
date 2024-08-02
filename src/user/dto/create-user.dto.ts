export class CreateUserDto {
    readonly userName: string;
             firstName: string;
             lastName: string;
    readonly password: string;
    readonly roles: string[];
    readonly email: string;
    readonly phoneNumber: string;
  }
  