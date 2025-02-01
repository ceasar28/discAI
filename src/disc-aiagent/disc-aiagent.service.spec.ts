import { Test, TestingModule } from '@nestjs/testing';
import { DiscAiagentService } from './disc-aiagent.service';

describe('DiscAiagentService', () => {
  let service: DiscAiagentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscAiagentService],
    }).compile();

    service = module.get<DiscAiagentService>(DiscAiagentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
