import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
    
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log debug message', () => {
    service.debug('Test debug message');
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it('should log info message', () => {
    service.info('Test info message');
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it('should log warn message', () => {
    service.warn('Test warn message');
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  it('should log error message', () => {
    service.error('Test error message');
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
