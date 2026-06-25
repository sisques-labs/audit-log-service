import { resolveAuditExceptionStatus } from '@/contexts/audit/transport/exceptions/audit-exception.filter';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { BaseException } from '@sisques-labs/nestjs-kit';
import { Response } from 'express';

@Catch(BaseException)
export class BaseExceptionFilter
  implements ExceptionFilter, GqlExceptionFilter
{
  catch(exception: BaseException, host: ArgumentsHost): void {
    const status = this.resolveStatus(exception);

    const type = host.getType<'http' | 'graphql'>();

    if (type === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      response.status(status).json({
        statusCode: status,
        message: exception.message,
        error: exception.name,
      });
    } else {
      throw Object.assign(exception, { statusCode: status });
    }
  }

  private resolveStatus(exception: BaseException): number {
    return resolveAuditExceptionStatus(exception) ?? HttpStatus.BAD_REQUEST;
  }
}
