import { Test, TestingModule } from '@nestjs/testing';
import { DiscordBot2Service } from './discord-bot2.service';

describe('DiscordBot2Service', () => {
  let service: DiscordBot2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscordBot2Service],
    }).compile();

    service = module.get<DiscordBot2Service>(DiscordBot2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
