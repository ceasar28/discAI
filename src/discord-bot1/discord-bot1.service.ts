import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { TextChannel, Client } from 'discord.js';
import * as dotenv from 'dotenv';
import { DiscAiagentService } from 'src/disc-aiagent/disc-aiagent.service';
dotenv.config();

const token = process.env.DISCORD_TOKEN1;

@Injectable()
export class DiscordBot1Service {
  private readonly logger = new Logger(DiscordBot1Service.name);
  private readonly client: Client;

  constructor(
    private readonly httpService: HttpService,
    private readonly agentService: DiscAiagentService,
  ) {
    this.client = new Client({
      intents: ['Guilds', 'GuildMessages', 'DirectMessages', 'MessageContent'],
    });
    // Login to Discord with your bot's token
    this.client.login(token);
    this.client.once('ready', this.onReady);
    this.client.on('warn', this.onWarn);
    this.client.on('messageCreate', this.handleRecievedMessages);
    this.client.on('messageCreate', this.handleDirectMessages);
    this.client.once('ready', this.startConversation);
  }

  onReady = async (client) => {
    this.logger.log(`Bot logged in as ${client.user.username}`);
  };

  onWarn = async (message) => {
    this.logger.warn(message);
  };

  handleRecievedMessages = async (message) => {
    console.log(message.channelId);
    if (
      message.author.id === process.env.DISCORD_BOT1_ID ||
      message.channelId !== process.env.NPC_BOT_CHANNEL_ID
    ) {
      return;
    }

    if (
      message.author.id === process.env.DISCORD_BOT2_ID &&
      message.channelId === process.env.NPC_BOT_CHANNEL_ID
    ) {
      // const url = process.env.URL2;
      // const payload = {
      //   userName: 'testingBot',
      //   name: 'testingBot',
      //   text: `${message.content.trim()}`,
      // };
      // const response = await this.httpService.axiosRef.post(url, payload);
      const agent1 = await this.agentService.agent1(
        `${message.content.trim()}`,
      );

      console.log('agent one   :', agent1);

      //response.data[0].text

      if (agent1.reply) {
        const channel = this.client.channels.cache.get(
          process.env.NPC_BOT_CHANNEL_ID,
        );
        await (<TextChannel>channel).sendTyping();

        if (channel?.isTextBased()) {
          // Send a message to the target channel
          setTimeout(async () => {
            return await (<TextChannel>channel).send(`${agent1.reply}`);
          }, 30000);
        }

        // setTimeout(() => {
        //   return message.reply({ content: `${response.data[0].text}` });
        // }, 10000); // 30000 milliseconds = 30 seconds
        // return message.reply({ content: `${response.data[0].text}` });
      }
    }
  };

  startConversation = async () => {
    const channel = this.client.channels.cache.get(
      process.env.NPC_BOT_CHANNEL_ID,
    );

    if (channel?.isTextBased()) {
      const startMessage = await this.agentService.randomStartChat();

      console.log('agent one is greeting  :', startMessage);

      if (startMessage.reply) {
        // Send a message to the target channel
        return await (<TextChannel>channel).send(`${startMessage.reply}`);
      }
      // Send a message to the target channel
      return await (<TextChannel>channel).send('hey');
    }
  };

  handleDirectMessages = async (message) => {
    // console.log(message);
    if (message.author.bot) return;
    const agent1 = await this.agentService.agentDirect(
      `${message.content.trim()}`,
      message.author.id,
    );

    console.log('agent one   :', agent1);

    //response.data[0].text

    if (agent1.reply) {
      const channel = this.client.channels.cache.get(
        process.env.DIRECT_CHAT_CHANNEL_ID,
      );
      await (<TextChannel>channel).sendTyping();

      if (channel?.isTextBased()) {
        // Send a message to the target channel
        setTimeout(async () => {
          return message.reply(`${agent1.reply}`);
          // return await (<TextChannel>channel).send(`${agent1.reply}`);
        }, 10000);
      }
    }
  };
}
