import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('generate-fake-data')
  generateFakeData(@Body('quantity') quantity: number): Promise<string> {
    return this.appService.generateFakeClients(quantity);
  }
}
