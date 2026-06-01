import { IsEmail } from "class-validator";

export class LoginUserInput {
    @IsEmail()
    email: string;
    
    password: string;
}
