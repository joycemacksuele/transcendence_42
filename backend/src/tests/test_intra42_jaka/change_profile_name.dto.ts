import { IsString, MinLength, MaxLength, IsAlphanumeric } from 'class-validator';

export class ChangeProfileNameDTO {
	@IsString()
	@MinLength(3)
	@MaxLength(10)
	@IsAlphanumeric()
	profileName: string;

	@IsString()
	loginName: string;
}