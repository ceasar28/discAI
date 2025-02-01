import { Test, TestingModule } from '@nestjs/testing';
import { DiscordBot1Service } from './discord-bot1.service';

describe('DiscordBot1Service', () => {
  let service: DiscordBot1Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscordBot1Service],
    }).compile();

    service = module.get<DiscordBot1Service>(DiscordBot1Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
