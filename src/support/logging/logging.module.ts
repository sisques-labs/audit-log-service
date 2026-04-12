import { Module } from '@nestjs/common';
import { defaultSharedWinstonLoggerOptions } from '@sisques-labs/nestjs-kit';
import { WinstonModule } from 'nest-winston';

@Module({
  imports: [WinstonModule.forRoot(defaultSharedWinstonLoggerOptions)],
  exports: [WinstonModule],
})
export class LoggingModule {}
