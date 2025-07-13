import type { IGetCurrentTimeUseCase, IGetCurrentTimeUseCaseInput, IGetCurrentTimeUseCaseOutput } from '../interfaces/get-current-time.usecase.interface.js';
import type { ITimeService } from '../../domain/interfaces/time.service.interface.js';
import { TimeServiceError } from '../../shared/errors/time.errors.js';

export class GetCurrentTimeUseCase implements IGetCurrentTimeUseCase {
  constructor(private readonly timeService: ITimeService) {}

  async execute(input?: IGetCurrentTimeUseCaseInput): Promise<IGetCurrentTimeUseCaseOutput> {
    try {
      const timeData = this.timeService.getCurrentTime({
        includeMilliseconds: input?.includeMilliseconds,
        timezone: input?.timezone,
      });

      return {
        success: true,
        data: timeData,
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
        error: 'An unexpected error occurred while retrieving the current time',
      };
    }
  }
}