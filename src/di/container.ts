import { TimeService } from '../domain/services/time.service.js';
import { GetCurrentTimeUseCase } from '../application/usecases/get-current-time.usecase.js';
import { GetISO8601TimeUseCase } from '../application/usecases/get-iso8601-time.usecase.js';
import { TimeServer } from '../infrastructure/mcp/time.server.js';
import type { ITimeService } from '../domain/interfaces/time.service.interface.js';
import type { IGetCurrentTimeUseCase } from '../application/interfaces/get-current-time.usecase.interface.js';
import type { IGetISO8601TimeUseCase } from '../application/interfaces/get-iso8601-time.usecase.interface.js';

export interface IContainer {
  timeService: ITimeService;
  getCurrentTimeUseCase: IGetCurrentTimeUseCase;
  getISO8601TimeUseCase: IGetISO8601TimeUseCase;
  timeServer: TimeServer;
}

export class Container implements IContainer {
  private static instance: Container;
  
  private _timeService: ITimeService | null = null;
  private _getCurrentTimeUseCase: IGetCurrentTimeUseCase | null = null;
  private _getISO8601TimeUseCase: IGetISO8601TimeUseCase | null = null;
  private _timeServer: TimeServer | null = null;

  private constructor() {
    // Private constructor for singleton pattern
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  get timeService(): ITimeService {
    if (!this._timeService) {
      this._timeService = new TimeService();
    }
    return this._timeService;
  }

  get getCurrentTimeUseCase(): IGetCurrentTimeUseCase {
    if (!this._getCurrentTimeUseCase) {
      this._getCurrentTimeUseCase = new GetCurrentTimeUseCase(this.timeService);
    }
    return this._getCurrentTimeUseCase;
  }

  get getISO8601TimeUseCase(): IGetISO8601TimeUseCase {
    if (!this._getISO8601TimeUseCase) {
      this._getISO8601TimeUseCase = new GetISO8601TimeUseCase(this.timeService);
    }
    return this._getISO8601TimeUseCase;
  }

  get timeServer(): TimeServer {
    if (!this._timeServer) {
      this._timeServer = new TimeServer({
        getCurrentTimeUseCase: this.getCurrentTimeUseCase,
        getISO8601TimeUseCase: this.getISO8601TimeUseCase,
      });
    }
    return this._timeServer;
  }

  reset(): void {
    this._timeService = null;
    this._getCurrentTimeUseCase = null;
    this._getISO8601TimeUseCase = null;
    this._timeServer = null;
  }
}