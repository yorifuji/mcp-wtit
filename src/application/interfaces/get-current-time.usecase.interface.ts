import type { ITimeData } from '../../shared/types/time.types.js';

export interface IGetCurrentTimeUseCaseInput {
  includeMilliseconds?: boolean;
  timezone?: string;
}

export interface IGetCurrentTimeUseCaseOutput {
  success: boolean;
  data?: ITimeData;
  error?: string;
}

export interface IGetCurrentTimeUseCase {
  execute(input?: IGetCurrentTimeUseCaseInput): Promise<IGetCurrentTimeUseCaseOutput>;
}