import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChecklistItemService } from './checklist-item.service';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';

@Controller('checklist-item')
export class ChecklistItemController {
  constructor(private readonly checklistItemService: ChecklistItemService) {}
}
