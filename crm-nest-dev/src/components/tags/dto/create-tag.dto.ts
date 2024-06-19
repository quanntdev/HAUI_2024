import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export class CreateTagDto {
  @IsString()
  @ApiProperty({ example: 'test' })
  name: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
