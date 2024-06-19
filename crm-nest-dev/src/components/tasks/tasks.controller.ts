import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
  Headers,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserSignedGuard } from 'src/common/guards/user';
import { CreateTaskDto } from './dto/create-task.dto';
import {
  PaginationQuery,
  PaginationQueryTask,
  PaginationQueryTaskByObjectId,
} from '../../common/dtos';

import { TasksService } from './tasks.service';
import { Req } from '@nestjs/common';
import { RequestWithUser } from 'src/common/interfaces';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateChecklistDto } from '../checklist/dto/create-checklist.dto';
import { ChecklistService } from '../checklist/checklist.service';
import { ChecklistItemService } from '../checklist-item/checklist-item.service';
import { CreateChecklistItemDto } from '../checklist-item/dto/create-checklist-item.dto';
import { UpdateChecklistDto } from '../checklist/dto/update-checklist.dto';
import { UpdateChecklistItemDto } from '../checklist-item/dto/update-checklist-item.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadFileRaw } from 'src/common/uploadImageHelper/file-helper';
import { BodyWithMiddleware } from 'src/common/utils/bodyWithMiddleware';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@Controller('api/tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly checklistService: ChecklistService,
    private readonly checklistItemService: ChecklistItemService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('attachment[]', 20, uploadFileRaw))
  @ApiConsumes('multipart/form-data')
  async create(
    @BodyWithMiddleware() createTaskDto: CreateTaskDto,
    @Req() req: RequestWithUser,
    @Headers() headers,
    @UploadedFiles() attachment: Array<Express.Multer.File>,
  ) {
    if (attachment.length == 0) {
      return await this.tasksService.create(createTaskDto, req, headers);
    }

    return await this.tasksService.create(
      createTaskDto,
      req,
      headers,
      attachment,
    );
  }

  @Post('checklist')
  async createCheckList(
    @Body() createChecklistDto: CreateChecklistDto,
    @Req() req: RequestWithUser,
  ) {
    return this.checklistService.create(createChecklistDto, req);
  }

  @Post('checklist/item')
  async createCheckListItem(
    @Body() createChecklistItemDto: CreateChecklistItemDto,
  ) {
    return this.checklistItemService.create(createChecklistItemDto);
  }
  @Patch('checklist/item/:id')
  async updateCheckListItem(
    @Param('id') id: string,
    @Body() updateChecklistItemDto: UpdateChecklistItemDto,
    @Req() req: RequestWithUser,
  ) {
    return this.checklistItemService.update(+id, updateChecklistItemDto, req);
  }
  @Delete('checklist/item/:id')
  async deleteCheckListItem(@Param('id') id: string) {
    return this.checklistItemService.remove(+id);
  }

  @Patch('checklist/:id')
  async updateChecklist(
    @Param('id') id: string,
    @Body() updateChecklistDto: UpdateChecklistDto,
  ) {
    return this.checklistService.update(+id, updateChecklistDto);
  }
  @Patch('archive/:id')
  archivedTask(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Headers() headers,
  ) {
    return this.tasksService.archivedTask(+id, req, headers);
  }

  @Delete('checklist/:id')
  async deleteChecklist(@Param('id') id: string) {
    return this.checklistService.remove(+id);
  }

  @Get()
  findAll(
    @Req() req: RequestWithUser,
    @Query() pagination: PaginationQueryTask,
  ) {
    return this.tasksService.findAll(pagination, req);
  }

  @Get('total')
  totalUserAssign(@Req() req: RequestWithUser) {
    return this.tasksService.totalUserAssign(req);
  }

  @Get('object-task')
  findByObjectId(
    @Req() req: RequestWithUser,
    @Query() pagination: PaginationQueryTaskByObjectId,
    @Headers() headers,
  ) {
    return this.tasksService.findByObjectId(pagination, req, headers);
  }

  @Get(':id')
  getTaskDetail(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Query() pagination: PaginationQuery,
    @Headers() headers,
  ) {
    return this.tasksService.getTaskDetail(+id, req, pagination, headers);
  }

  @Put(':id')
  updateTask(
    @Param('id') id: string,
    @Body() updateTask: UpdateTaskDto,
    @Req() req: RequestWithUser,
    @Headers() headers,
  ) {
    return this.tasksService.updateTask(+id, req, updateTask, headers);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers() headers) {
    return this.tasksService.deleteTask(+id, headers);
  }

  // @Put('update-status/:id')
  // updateTaskStatus(
  //   @Param('id') id: string,
  //   @Body() updateTask: UpdateStatusTaskDto,
  //   @Req() req: RequestWithUser,
  //   @Headers() headers,
  // ) {
  //   return this.tasksService.updateTaskStatus(+id, req, updateTask, headers);
  // }
}
