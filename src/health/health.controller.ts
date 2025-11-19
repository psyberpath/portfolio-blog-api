import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}
  @Get()
  async check() {
    try {
      await this.dataSource.query('SELECT 1');
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown database error';
      throw new InternalServerErrorException({
        status: 'error',
        database: 'disconnected',
        error: message,
      });
    }
  }
}
