import type { IGetISO8601TimeUseCase, IGetISO8601TimeUseCaseInput, IGetISO8601TimeUseCaseOutput } from '../interfaces/get-iso8601-time.usecase.interface.js';
import type { ITimeService } from '../../domain/interfaces/time.service.interface.js';
import { TimeServiceError } from '../../shared/errors/time.errors.js';

export class GetISO8601TimeUseCase implements IGetISO8601TimeUseCase {
  constructor(private readonly timeService: ITimeService) {}

  async execute(input?: IGetISO8601TimeUseCaseInput): Promise<IGetISO8601TimeUseCaseOutput> {
    try {
      const iso8601 = this.timeService.getCurrentTimeISO8601({
        includeMilliseconds: input?.includeMilliseconds,
        timezone: input?.timezone,
      });

      return {
        success: true,
        iso8601,
      };
    } catch (error) {
      if (error instanceof TimeServiceError) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: false,
        error: 'An unexpected error occurred while retrieving the ISO8601 time',
      };
    }
  }
}