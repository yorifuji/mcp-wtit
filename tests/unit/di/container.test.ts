import { describe, it, expect, beforeEach } from 'vitest';
import { Container } from '../../../src/di/container.js';
import { TimeService } from '../../../src/domain/services/time.service.js';
import { GetCurrentTimeUseCase } from '../../../src/application/usecases/get-current-time.usecase.js';
import { GetISO8601TimeUseCase } from '../../../src/application/usecases/get-iso8601-time.usecase.js';
import { TimeServer } from '../../../src/infrastructure/mcp/time.server.js';

// Type definition for Container's private properties
interface IContainerWithPrivate {
  instance: Container | null;
}

interface IUseCaseWithPrivate {
  timeService: TimeService;
}

interface ITimeServerWithPrivate {
  dependencies: {
    getCurrentTimeUseCase: GetCurrentTimeUseCase;
    getISO8601TimeUseCase: GetISO8601TimeUseCase;
  };
}

describe('Container', () => {
  let container: Container;

  beforeEach(() => {
    // Reset singleton instance
    const containerClass = Container as unknown as IContainerWithPrivate;
    containerClass.instance = null;
    container = Container.getInstance();
  });

  describe('getInstance', () => {
    it('should return the same instance (singleton)', () => {
      const instance1 = Container.getInstance();
      const instance2 = Container.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('timeService', () => {
    it('should return TimeService instance', () => {
      const service = container.timeService;

      expect(service).toBeInstanceOf(TimeService);
    });

    it('should return the same TimeService instance', () => {
      const service1 = container.timeService;
      const service2 = container.timeService;

      expect(service1).toBe(service2);
    });
  });

  describe('getCurrentTimeUseCase', () => {
    it('should return GetCurrentTimeUseCase instance', () => {
      const useCase = container.getCurrentTimeUseCase;

      expect(useCase).toBeInstanceOf(GetCurrentTimeUseCase);
    });

    it('should return the same GetCurrentTimeUseCase instance', () => {
      const useCase1 = container.getCurrentTimeUseCase;
      const useCase2 = container.getCurrentTimeUseCase;

      expect(useCase1).toBe(useCase2);
    });

    it('should use the same timeService instance', () => {
      const timeService = container.timeService;
      const useCase = container.getCurrentTimeUseCase;

      // Access private property for testing
      const useCaseWithPrivate = useCase as unknown as IUseCaseWithPrivate;
      const useCaseTimeService = useCaseWithPrivate.timeService;
      expect(useCaseTimeService).toBe(timeService);
    });
  });

  describe('getISO8601TimeUseCase', () => {
    it('should return GetISO8601TimeUseCase instance', () => {
      const useCase = container.getISO8601TimeUseCase;

      expect(useCase).toBeInstanceOf(GetISO8601TimeUseCase);
    });

    it('should return the same GetISO8601TimeUseCase instance', () => {
      const useCase1 = container.getISO8601TimeUseCase;
      const useCase2 = container.getISO8601TimeUseCase;

      expect(useCase1).toBe(useCase2);
    });

    it('should use the same timeService instance', () => {
      const timeService = container.timeService;
      const useCase = container.getISO8601TimeUseCase;

      // Access private property for testing
      const useCaseWithPrivate = useCase as unknown as IUseCaseWithPrivate;
      const useCaseTimeService = useCaseWithPrivate.timeService;
      expect(useCaseTimeService).toBe(timeService);
    });
  });

  describe('timeServer', () => {
    it('should return TimeServer instance', () => {
      const server = container.timeServer;

      expect(server).toBeInstanceOf(TimeServer);
    });

    it('should return the same TimeServer instance', () => {
      const server1 = container.timeServer;
      const server2 = container.timeServer;

      expect(server1).toBe(server2);
    });

    it('should use the same use case instances', () => {
      const getCurrentTimeUseCase = container.getCurrentTimeUseCase;
      const getISO8601TimeUseCase = container.getISO8601TimeUseCase;
      const server = container.timeServer;

      // Access private property for testing
      const serverWithPrivate = server as unknown as ITimeServerWithPrivate;
      const serverDependencies = serverWithPrivate.dependencies;
      expect(serverDependencies.getCurrentTimeUseCase).toBe(getCurrentTimeUseCase);
      expect(serverDependencies.getISO8601TimeUseCase).toBe(getISO8601TimeUseCase);
    });
  });

  describe('reset', () => {
    it('should reset all instances', () => {
      // Get instances
      const service1 = container.timeService;
      const useCase1 = container.getCurrentTimeUseCase;
      const useCase2 = container.getISO8601TimeUseCase;
      const server1 = container.timeServer;

      // Reset
      container.reset();

      // Get new instances
      const service2 = container.timeService;
      const useCase3 = container.getCurrentTimeUseCase;
      const useCase4 = container.getISO8601TimeUseCase;
      const server2 = container.timeServer;

      // All should be different instances
      expect(service2).not.toBe(service1);
      expect(useCase3).not.toBe(useCase1);
      expect(useCase4).not.toBe(useCase2);
      expect(server2).not.toBe(server1);
    });
  });
});