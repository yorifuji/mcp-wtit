export interface IGetISO8601TimeUseCaseInput {
  includeMilliseconds?: boolean;
  timezone?: string;
}

export interface IGetISO8601TimeUseCaseOutput {
  success: boolean;
  iso8601?: string;
  error?: string;
}

export interface IGetISO8601TimeUseCase {
  execute(input?: IGetISO8601TimeUseCaseInput): Promise<IGetISO8601TimeUseCaseOutput>;
}