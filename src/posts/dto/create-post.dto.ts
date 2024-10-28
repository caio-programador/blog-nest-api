import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreatePostDto {
  @ApiProperty({description: 'O Titulo do post'})
  @IsString()
  @IsNotEmpty()
  title: string
  @ApiProperty({description: 'A descrição do post'})
  @IsString()
  @IsNotEmpty()
  description: string
}
