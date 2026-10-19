import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Deliberately skips the database: uptime pings hit this every few minutes
  // to keep the free host awake, and touching Postgres each time would also
  // keep Neon's compute running and burn its free monthly hours.
  @Get('health')
  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}
