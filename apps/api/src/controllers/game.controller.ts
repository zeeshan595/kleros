import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator';

export class CreateGameBodyDto {
  @IsString()
  @IsNotEmpty()
  @IsEthereumAddress()
  @ApiProperty()
  contractAddress: string;

  @IsString()
  @IsNotEmpty()
  @IsEthereumAddress()
  @ApiProperty()
  opponent: string;
}

@Controller('game')
export class GameController {
  @Post()
  @ApiOperation({
    description: 'submit a new game created through smart contract',
  })
  @ApiCreatedResponse()
  createNewGame(@Body() body: CreateGameBodyDto) {
    // todo: store contract address for game
  }
}
