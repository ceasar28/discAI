import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { TextChannel, Client } from 'discord.js';
import * as dotenv from 'dotenv';
import { DiscAiagentService } from 'src/disc-aiagent/disc-aiagent.service';
// import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { LastMessage } from 'src/disc-aiagent/schemas/chat.schema';
import { Model } from 'mongoose';
dotenv.config();

const token = process.env.DISCORD_TOKEN2;

@Injectable()
export class DiscordBot2Service {
  private readonly logger = new Logger(DiscordBot2Service.name);
  private readonly client: Client;
  private isAwake = true;
  private sleepStartTime: Date | null = null;
  private awakeStartTime: Date | null = null;

  constructor(
    private readonly httpService: HttpService,
    private readonly agentService: DiscAiagentService,
    @InjectModel(LastMessage.name)
    private readonly lastMessageModel: Model<LastMessage>,
  ) {
    this.client = new Client({
      intents: ['Guilds', 'GuildMessages', 'DirectMessages', 'MessageContent'],
    });
    // Login to Discord with your bot's token
    this.client.login(token);
    this.client.once('ready', this.onReady);
    this.client.on('warn', this.onWarn);
    this.client.on('messageCreate', this.handleRecievedMessages);
    this.awakeStartTime = new Date();
  }

  onReady = async (client) => {
    this.logger.log(`Bot logged in as ${client.user.username}`);
  };

  onWarn = async (message) => {
    this.logger.warn(message);
  };

  handleRecievedMessages = async (message) => {
    console.log('agent username', message.author.username);
    if (
      message.author.id === process.env.DISCORD_BOT2_ID ||
      message.channelId !== process.env.NPC_BOT_CHANNEL_ID
    ) {
      return;
    }

    if (
      message.author.id === process.env.DISCORD_BOT1_ID &&
      message.channelId === process.env.NPC_BOT_CHANNEL_ID
    ) {
      // if (!this.isAwake) {
      //   // save the last message
      //   await this.lastMessageModel.updateOne(
      //     {},
      //     {
      //       $set: {
      //         message: message.content.trim(),
      //       },
      //     },
      //     { upsert: true },
      //   );

      //   return;
      // }
      // const url = process.env.URL2;
      // const payload = {
      //   userName: 'testingBot',
      //   name: 'testingBot',
      //   text: `${message.content.trim()}`,
      // };
      // const response = await this.httpService.axiosRef.post(url, payload);
      const agent2 = await this.agentService.agent2(
        `${message.content.trim()}`,
      );

      console.log('agent two   :', agent2);

      //response.data[0].text

      if (agent2.reply) {
        const channel = this.client.channels.cache.get(
          process.env.NPC_BOT_CHANNEL_ID,
        );
        await (<TextChannel>channel).sendTyping();

        if (channel?.isTextBased()) {
          // Send a message to the target channel
          setTimeout(async () => {
            return await (<TextChannel>channel).send(`${agent2.reply}`);
          }, 30000);
        }

        // setTimeout(() => {
        //   return message.reply({ content: `${response.data[0].text}` });
        // }, 10000); // 30000 milliseconds = 30 seconds
        // return message.reply({ content: `${response.data[0].text}` });
      }
    }
  };

  sleepBot = async () => {
    try {
      await this.client.destroy();
      this.logger.log(`${this.client.user.username} is sleeping`);
      this.isAwake = false;
      this.sleepStartTime = new Date();
    } catch (error) {
      console.log(error);
    }
  };

  wakeBot = async () => {
    try {
      await this.client.login(token);
      this.logger.log(`${this.client.user.username} is awake`);
      this.isAwake = true;
      this.awakeStartTime = new Date();
      try {
        const lastMessage = await this.lastMessageModel.findOne({});

        const agent2 = await this.agentService.agent2(`${lastMessage.message}`);
        if (agent2.reply) {
          const channel = this.client.channels.cache.get(
            process.env.NPC_BOT_CHANNEL_ID,
          );
          await (<TextChannel>channel).sendTyping();

          if (channel?.isTextBased()) {
            // Send a message to the target channel
            await (<TextChannel>channel).send(`${agent2.reply}`);

            return;
          }
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // @Cron('*/2 * * * *')
  // async runCron(): Promise<void> {
  //   console.log('running cron');
  //   try {
  //     if (this.isAwake) {
  //       const currentTime = new Date();
  //       const awakeTime = currentTime.getTime() - this.awakeStartTime.getTime();
  //       const awakeTimeInMinutes = awakeTime / (1000 * 60);
  //       if (awakeTimeInMinutes >= 3) {
  //         //30
  //         return await this.sleepBot();
  //       } else {
  //         return;
  //       }
  //     } else {
  //       const currentTime = new Date();
  //       const sleepTime = currentTime.getTime() - this.sleepStartTime.getTime();
  //       const sleepTimeInMinutes = sleepTime / (1000 * 60);
  //       if (sleepTimeInMinutes >= 1) {
  //         return await this.wakeBot();
  //       } else {
  //         return;
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
}
