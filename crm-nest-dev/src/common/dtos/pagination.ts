import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class PaginationQuery {
  offset: number;
  limit: number;
  keyword: string;
  filters: { [name: string]: any };
  // sorts: { field: string, order: 'ASC' | 'DESC' };
}

export class PaginationQueryOrder extends PaginationQuery {
  ratePoint: number;
}

export class PaginationQueryToken {
  @ApiProperty({
    required: false,
    example: 'lorem',
  })
  @IsOptional()
  token: string;
}
export class PaginationQueryTask {
  offset: number;
  limit: number;

  @ApiProperty({
    required: false,
    example: 'Test',
  })
  keyword: string;

  @ApiProperty({
    required: false,
    example: false,
  })
  @IsOptional()
  archived: boolean;

  @ApiProperty({
    required: false,
    example: 1,
  })
  @IsOptional()
  userAssign: number;

  @ApiProperty({
    required: false,
    example: 1,
  })
  @IsOptional()
  statusId: number;

  @ApiProperty({
    required: false,
    example: false,
  })
  @IsOptional()
  mytask: boolean;

  filters: { [name: string]: any };
  // sorts: { field: string, order: 'ASC' | 'DESC' };

  @ApiProperty({
    required: false,
    example: 'ASC',
  })
  typeSort: string;

  @ApiProperty({
    required: false,
    example: 'dueDate',
  })
  sortBy: string;

  @ApiProperty({
    required: false,
    example: '22023-03-01',
  })
  filterStartDate: string;

  @ApiProperty({
    required: false,
    example: '2023-03-01',
  })
  filterDueDate: string;

  @ApiProperty({
    required: false,
    example: '22023-03-01',
  })
  startTime: string;

  @ApiProperty({
    required: false,
    example: '2023-03-01',
  })
  endTime: string;

  @ApiProperty({
    required: false,
    example: 'Task name',
  })
  taskName: string;

  @ApiProperty({
    required: false,
    example: 'true',
  })
  newClient: string;
}

export class PaginationQueryLogNote {
  offset: number;
  limit: number;

  @ApiProperty({
    required: false,
    example: 1,
  })
  findBy: string;

  @ApiProperty({
    required: false,
    example: 'all',
  })
  show: string;
}

export class PaginationQueryTaskByObjectId {
  offset: number;
  limit: number;

  @ApiProperty({
    required: false,
    example: 1,
  })
  @IsOptional()
  customerId: number;

  @ApiProperty({
    required: false,
    example: 1,
  })
  @IsOptional()
  dealId: number;

  @ApiProperty({
    required: false,
    example: 1,
  })
  @IsOptional()
  orderId: number;

  @ApiProperty({
    required: false,
    example: 1,
  })
  @IsOptional()
  invoiceId: number;
}

export class PaginationResponseWithTotalData<T> {
  constructor(
    private items: T[],
    private total: number = 0,
    private todayData: {} = null,
    private thisMonthData: {} = null,
    private thisYearData: {} = null,
    private totalData: {} = null,
  ) {}
}

export class PaginationResponse<T> {
  constructor(private items: T[], private total: number = 0) {}
}
