import { HealthResponseDto } from '@/core/health/transport/rest/dtos/health-response.dto';
import { Controller, Get, HttpCode, HttpStatus, Logger } from '@nestjs/common';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  @Get()
  @HttpCode(HttpStatus.OK)
  check(): HealthResponseDto {
    this.logger.debug('Health check called');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
