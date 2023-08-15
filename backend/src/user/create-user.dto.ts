/*
	The create-user.dto.ts file is a data transfer object (DTO) that defines the structure and validation rules for the data required to create a user. It is used for validating and transferring data between different layers of your application, such as the API endpoints and the service layer. The DTO provides a separate representation of the data required for user creation, allowing you to enforce validation rules specific to that operation.
*/

//import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

// DTOs are short Data Transfer Objects. They can be interfaces objects that determine how data
// will be sent in a post request body and response.
export class CreateUserDto {
  // @IsNotEmpty()
  loginName: string;

  //@IsNotEmpty()
  //@IsEmail()
  //email: string;

  //@IsNotEmpty()
  //@MinLength(8)
  //password: string;
}
