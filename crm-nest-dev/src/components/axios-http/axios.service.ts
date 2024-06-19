import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';


export interface HeaderType {
  redirect :string ,
  headers : {apikey : string}
  params : {}
}

@Injectable()
export class AxiosService {
  constructor(
    private readonly httpService : HttpService
  ) {}

  async get(url: string, option: any ){
    const response = await this.httpService.get(url, {...option}).toPromise();
    return response.data;
  }
}