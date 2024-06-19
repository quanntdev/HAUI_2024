import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CidService } from './cid.service';
import { CreateCidDto } from './dto/create-cid.dto';
import { UpdateCidDto } from './dto/update-cid.dto';
import { UserSignedGuard } from '../../common/guards/user';

@ApiTags('Cid')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@Controller('api/cid')
export class CidController {
  constructor(private readonly cidService: CidService) {}

}
