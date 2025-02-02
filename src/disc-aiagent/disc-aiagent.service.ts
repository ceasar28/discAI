import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import OpenAI from 'openai';
import {
  Chat,
  DirectChat,
  RepliedCurrentTopic,
  Topics,
} from './schemas/chat.schema';
import { Model } from 'mongoose';
import { degenerateTopics } from './topics';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
// import { trainnedData1 } from './trainingData/trainnedData1';

@Injectable()
export class DiscAiagentService {
  private readonly openai: OpenAI;

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Chat.name) private readonly ChatModel: Model<Chat>,
    @InjectModel(Topics.name) private readonly TopicsModel: Model<Topics>,
    @InjectModel(RepliedCurrentTopic.name)
    private readonly RepliedCurrentTopicModel: Model<RepliedCurrentTopic>,
    @InjectModel(DirectChat.name)
    private readonly DirectChatModel: Model<DirectChat>,
  ) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    this.saveTopics();
  }

  private async saveTopics() {
    await this.TopicsModel.updateOne(
      {},
      {
        $set: {
          topics: degenerateTopics,
          trendingTokens: [{ token: '', poolAddress: '', tokenPrice: '' }],
        },
      },
      { upsert: true },
    );
  }

  // private async fetchSettings() {
  //   const settings = await this.TopicsModel.findOne();
  //   return {
  //     topics: settings?.topics || [],
  //     usedTopics: settings?.usedTopics || [],
  //     currentTopic: settings?.currentTopic || '',
  //     trendingTokens: settings?.trendingTokens || [
  //       { token: '', poolAddress: '', tokenPrice: '' },
  //     ],
  //   };
  // }

  private async fetchSettings() {
    const settings = await this.TopicsModel.findOne();
    return {
      topics: settings?.topics || [],
      usedTopics: settings?.usedTopics || [],
      currentTopic: settings?.currentTopic || '',
    };
  }

  // private async saveSettings(settings: {
  //   topics: string[];
  //   currentTopic: string;
  //   trendingTokens: any[];
  // }) {
  //   await this.TopicsModel.updateOne(
  //     {},
  //     { $set: settings },
  //     { upsert: true }, // Create if it doesn't exist
  //   );
  // }

  private async saveSettings(settings: {
    topics: string[];
    currentTopic: string;
  }) {
    await this.TopicsModel.updateOne(
      {},
      { $set: settings },
      { upsert: true }, // Create if it doesn't exist
    );
  }

  // private async fetchTrendingTokens(): Promise<any> {
  //   try {
  //     const response = await this.httpService.axiosRef.get(
  //       process.env.TRENDING_TOKEN_URL,
  //     );
  //     const tokens = response.data.data; // Adjust based on the API response structure
  //     return [tokens[0]];
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // private async checkTrendingTokens() {
  //   const settings = await this.fetchSettings();
  //   const newTokens = await this.fetchTrendingTokens();
  //   function extractTokenName(input) {
  //     const match = input.match(
  //       /^([a-zA-Z0-9]+)(?:\s*\/\s*|\/)([a-zA-Z0-9]+)?/,
  //     );
  //     return match ? match[1] : null;
  //   }
  //   const tokens = newTokens.map((token) => {
  //     return {
  //       token: extractTokenName(token.attributes.name),
  //       poolAddress: token.attributes.address,
  //       tokenPrice: token.attributes.base_token_price_usd,
  //     };
  //   });
  //   console.log('lenght :', tokens.length);
  //   console.log(tokens[0].token);
  //   console.log(settings.trendingTokens[0].token);
  //   if (tokens.length > 0) {
  //     if (tokens[0].token !== settings.trendingTokens[0].token) {
  //       // Update the trending tokens in the database
  //       settings.trendingTokens = [tokens[0]];
  //       await this.saveSettings(settings);

  //       console.log(`Trending tokens updated: ${tokens[0]}`);
  //       return tokens[0]; // Return the new tokens for conversation
  //     }
  //   }

  //   return null; // No change in tokens
  // }

  // private async updateContext() {
  //   const settings = await this.fetchSettings();
  //   const newTokens = await this.checkTrendingTokens();
  //   let contextChanged = false;

  //   if (newTokens) {
  //     // If tokens changed, set the topic to discuss them
  //     settings.currentTopic = `This token is trending, token name: ${newTokens.token}, price: ${newTokens.tokenPrice} dollars, token address: ${newTokens.poolAddress}`;
  //     contextChanged = true;
  //     settings.trendingTokens = newTokens;

  //     await this.RepliedCurrentTopicModel.updateOne(
  //       {},
  //       {
  //         $set: {
  //           topic: `Trending tokens: ${newTokens.token}, price: ${newTokens.tokenPrice} dollars, address: ${newTokens.poolAddress}`,
  //           repliedCurrentTopicA: false,
  //           repliedCurrentTopicB: false,
  //         },
  //       },
  //       { upsert: true },
  //     );
  //   } else if (Math.random() < 0.3) {
  //     // 30% chance to switch topic
  //     const availableTopics = settings.topics.filter(
  //       (topic) => !settings.usedTopics.includes(topic),
  //     );

  //     if (availableTopics.length === 0) {
  //       console.log('All topics have been used. Resetting usedTopics.');
  //       // Reset the usedTopics array to allow reuse
  //       settings.usedTopics = [];
  //       return;
  //     }

  //     // Select a random topic from the available topics
  //     const randomTopic =
  //       availableTopics[Math.floor(Math.random() * availableTopics.length)];

  //     settings.currentTopic = randomTopic;
  //     settings.usedTopics.push(randomTopic); // Add topic to usedTopics
  //     contextChanged = true;

  //     await this.RepliedCurrentTopicModel.updateOne(
  //       {},
  //       {
  //         $set: {
  //           topic: randomTopic,
  //           repliedCurrentTopicA: false,
  //           repliedCurrentTopicB: false,
  //         },
  //       },
  //       { upsert: true },
  //     );
  //   }

  //   await this.saveSettings(settings); // Save the updated context
  //   console.log('context changed  :', contextChanged);
  //   return {
  //     currentTopic: settings.currentTopic,
  //     didContextChanged: contextChanged,
  //   };
  // }

  private async updateContext() {
    const settings = await this.fetchSettings();
    let contextChanged = false;

    if (Math.random() < 0.3) {
      // 30% chance to switch topic
      const availableTopics = settings.topics.filter(
        (topic) => !settings.usedTopics.includes(topic),
      );

      if (availableTopics.length === 0) {
        console.log('All topics have been used. Resetting usedTopics.');
        // Reset the usedTopics array to allow reuse
        settings.usedTopics = [];
      }

      // Select a random topic from the available topics
      const randomTopic =
        availableTopics[Math.floor(Math.random() * availableTopics.length)];

      settings.currentTopic = randomTopic;
      settings.usedTopics.push(randomTopic); // Add topic to usedTopics
      contextChanged = true;

      await this.RepliedCurrentTopicModel.updateOne(
        {},
        {
          $set: {
            topic: randomTopic,
            repliedCurrentTopicA: false,
            repliedCurrentTopicB: false,
          },
        },
        { upsert: true },
      );
    }

    await this.saveSettings(settings); // Save the updated context
    console.log('context changed  :', contextChanged);
    return {
      currentTopic: settings.currentTopic,
      didContextChanged: contextChanged,
    };
  }

  async fetchChatHistory(Bot: string) {
    try {
      const allChats = await this.ChatModel.find();
      if (Bot === 'botA') {
        return allChats
          .map((chat) => [
            { role: 'user', content: chat.contentB },
            { role: 'assistant', content: chat.contentA },
          ])
          .flat();
      } else {
        return allChats
          .map((chat) => [
            // { role: 'system', content: chat.promptB },
            { role: 'user', content: chat.contentA },
            { role: 'assistant', content: chat.contentB },
          ])
          .flat();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchDirectChatHistory(userId: number) {
    try {
      const allChats = await this.DirectChatModel.find({ userId });
      if (allChats.length > 0) {
        return allChats
          .map((chat) => [
            { role: 'user', content: chat.message },
            { role: 'assistant', content: chat.response },
          ])
          .flat();
      }
      return [];
    } catch (error) {
      console.log(error);
    }
  }

  async randomStartChat() {
    const prompt = `Start a random this conversation, this conversation I want you to speak to me and respond to me like a degenerate discord/telegram crypto trader, don't use formal grammer or any emojis, and Don't repeat yourself

Do not mention any token name, Do not use emojis. Keep responses concise (80 characters max) and avoid repeating sentences. Do not repeat any previous responses from this conversation. Ensure all responses are unique and relevant to the current message. Don't use '—' in any sentence and also dont end replies with '!', also don't end a reply with a question.
`;

    try {
      const response = await this.openai.chat.completions.create({
        messages: [
          { role: 'system', content: `${prompt}` },
          {
            role: 'user',
            content: 'generate a random message to start a chat',
          },
        ],
        model: 'gpt-4o-mini',
        temperature: 0.5,
        frequency_penalty: 1.5,
        presence_penalty: 1.0,
        max_tokens: 150,
      });

      const reply =
        response.choices[0].message?.content.trim() ||
        'No witty reply this time!';

      return { reply };
    } catch (error) {
      console.log(error);
    }
  }

  //   async agent1(message: string) {
  //     const currentTopic = await this.updateContext();
  //     const replied = await this.RepliedCurrentTopicModel.findOne();

  //     const prompt = `
  // You are 'Degen Dan,' a reckless crypto trader who loves high-risk, high-reward moves.
  // You thrive on chaos, dive into DeFi, and ape into low-cap gems without hesitation.
  // Your tone is wild, confident, and humorous, using crypto slang like 'APE,' 'rug,' and 'GM.'
  // Do not mention any token name, Do not use emojis. and also don't repeart any phrase or first word of any sentences from these conversations. Keep responses concise (80 characters max) and avoid repeating sentences. Do not repeat any previous responses from this conversation. Ensure all responses are unique and relevant to the current message. Don't use '—' in any sentence and also don't end sentence with '!'
  // `;
  //     const currentTopicPrompt = `
  // You are 'Degen Dan,' a reckless crypto trader who loves high-risk, high-reward moves.
  // You thrive on chaos, dive into DeFi, and ape into low-cap gems without hesitation.
  // Your tone is wild, confident, and humorous, using crypto slang like 'APE,' 'rug,' and 'GM.'
  // The current topic of discussion is: ${currentTopic.currentTopic}. if the topic has a token name, price and address, talk about them.
  // Do not use emojis. Keep responses concise (80 characters max) and avoid repeating sentences. Don't use '—' in any sentence and also don't end sentence with '!'
  // `;

  //     try {
  //       const chatHistory = await this.fetchChatHistory('botA');
  //       let allMessages: any;
  //       let PromptUsed: string;
  //       console.log('did context change :', currentTopic.didContextChanged);
  //       if (
  //         currentTopic.didContextChanged &&
  //         currentTopic.currentTopic === replied.topic &&
  //         !replied.repliedCurrentTopic
  //       ) {
  //         PromptUsed = currentTopicPrompt;
  //         allMessages = [
  //           { role: 'system', content: `${prompt}` },
  //           ...chatHistory,
  //           { role: 'user', content: `${message}` },
  //           { role: 'system', content: `${currentTopicPrompt}` },
  //           {
  //             role: 'user',
  //             content: `start a conversation around the topic ${currentTopic.currentTopic},if it is a token state the name of the token , price and it token addresss`,
  //           },
  //         ];

  //         await this.RepliedCurrentTopicModel.updateOne(
  //           {},
  //           {
  //             $set: {
  //               repliedCurrentTopic: true,
  //             },
  //           },
  //           { upsert: true },
  //         );
  //       } else if (replied && replied.repliedCurrentTopic) {
  //         PromptUsed = prompt;
  //         allMessages = [
  //           { role: 'system', content: `${prompt}` },
  //           ...chatHistory,
  //           { role: 'system', content: `${prompt}` },
  //           { role: 'user', content: `${message}` },
  //         ];

  //         await this.RepliedCurrentTopicModel.deleteMany();
  //       } else {
  //         allMessages = [
  //           { role: 'system', content: `${prompt}` },
  //           ...chatHistory,
  //           { role: 'user', content: `${message}` },
  //         ];
  //       }

  //       const response = await this.openai.chat.completions.create({
  //         messages: allMessages as Array<ChatCompletionMessageParam>,
  //         model: 'gpt-4o-mini',
  //         temperature: 0.5,
  //         frequency_penalty: 1.5,
  //         presence_penalty: 1.0,
  //         max_tokens: 150,
  //       });

  //       const reply =
  //         response.choices[0].message?.content.trim() ||
  //         'No witty reply this time!';

  //       const saveChat = new this.ChatModel({
  //         contentB: message,
  //         contentA: reply,
  //         promptA: PromptUsed,
  //       });
  //       await saveChat.save();
  //       return { reply };
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  async agentDirect(message: string, userId: number) {
    //     const basePrompt = `
    // You are 'Degen Dan,' a reckless crypto trader with a love for high-risk, high-reward moves.
    // Your style is chaotic, humorous, and packed with crypto jargon.reply this conversation, and dont repeat the message prompt
    // `;

    const basePrompt = `For the rest of this conversation I want you to speak to me and respond to me like a degenerate discord/telegram crypto trader, don't use formal grammer or any emojis,and Don't repeat yourself`;

    try {
      const chatHistory = await this.fetchDirectChatHistory(userId);

      const allMessages = [
        {
          role: 'system',
          content: `${basePrompt}`,
        },
        ...chatHistory,
        {
          role: 'user',
          content: `reply this message ${message}`,
        },
      ];

      const response = await this.openai.chat.completions.create({
        messages: allMessages as Array<ChatCompletionMessageParam>,
        model: 'ft:gpt-4o-2024-08-06:techfromroot:discaibot4:Avo5tpZa',
        temperature: 1.0, // Increased for more creativity in responses
        frequency_penalty: 2.0, // Higher penalty to avoid repeating words or phrases
        presence_penalty: 2.0, // Higher penalty for avoiding repetitive themes or ideas
        max_tokens: 150,
      });

      const reply =
        response.choices[0].message?.content?.trim() ||
        'Oops, no clever comeback today.';

      // Save the conversation
      const saveChat = new this.DirectChatModel({
        userId,
        message,
        response: reply,
      });
      await saveChat.save();

      return { reply };
    } catch (error) {
      console.error('Error in agent1:', error);
      return { reply: 'Something went wrong, try again later!' };
    }
  }

  //   async agent2(message: string) {
  //     // const currentTopic = await this.updateContext();
  //     const prompt = `
  // You are 'Moonie Max,' an energetic trader obsessed with chasing 1000x meme tokens.
  // You thrive on market hype, FOMO, and spotting the next big moonshot. Your tone is
  // playful, exaggerated, and filled with buzzwords like 'to the moon,' 'HODL,' and 'rekt.'
  // Do not mention any token name,Do not use emojis. Keep responses concise (80 characters max) and  Do not repeat any previous responses from this conversation. and also don't repeart any phrase or first word of any sentences from these conversations, Ensure all responses are unique and relevant to the current message. Ensure each reply feels unique, engaging, and aligned with the context. Don't use '—' in any sentence and also don't end sentence with '!'
  // `;

  //     try {
  //       const chatHistory = await this.fetchChatHistory('botB');
  //       const allMessages = [
  //         { role: 'system', content: `${prompt}` },
  //         ...chatHistory,
  //         { role: 'user', content: `${message}` },
  //       ];

  //       const response = await this.openai.chat.completions.create({
  //         messages: allMessages as Array<ChatCompletionMessageParam>,
  //         model: 'gpt-4o-mini',
  //         temperature: 0.5,
  //         frequency_penalty: 1.5,
  //         presence_penalty: 1.0,
  //         max_tokens: 150,
  //       });

  //       const reply =
  //         response.choices[0].message?.content.trim() ||
  //         'No witty reply this time!';

  //       const saveChat = new this.ChatModel({
  //         contentA: message,
  //         contentB: reply,
  //         promptB: prompt,
  //       });
  //       await saveChat.save();
  //       return { reply };
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  async agent3(message: string) {
    const prompt = `
You are 'Moonie Max,' an energetic trader hunting for 1000x meme tokens. 
You're all about market hype, FOMO.
Your speech is playful, over-the-top, and loaded with crypto lingo like 'to the moon,' 'HODL,' and 'rekt.' 
Avoid mentioning specific tokens or emojis. 
Keep responses short (80 characters max), ensure they're unique, and never repeat phrases or sentence starters from past chats. 
Make each reply engaging, contextually relevant, and distinctly human. 
Avoid using '—' or ending sentences with '!'
`;

    try {
      const chatHistory = await this.fetchChatHistory('botB');
      const allMessages = [
        { role: 'system', content: prompt },
        ...chatHistory,
        { role: 'user', content: message },
      ];

      const response = await this.openai.chat.completions.create({
        messages: allMessages as Array<ChatCompletionMessageParam>,
        model: 'gpt-4o-mini',
        temperature: 0.7, // Increased for more creative, human-like responses
        frequency_penalty: 2.0, // Higher to avoid word repetition
        presence_penalty: 1.5, // Higher to discourage repeating themes
        max_tokens: 150,
      });

      const reply =
        response.choices[0].message?.content.trim() ||
        'Oops, no witty comeback this time.';

      // Save the interaction
      const saveChat = new this.ChatModel({
        contentA: message,
        contentB: reply,
        promptB: prompt,
      });
      await saveChat.save();

      return { reply };
    } catch (error) {
      console.error('Error in agent2:', error);
      return { reply: "Something's off, let's try again later!" };
    }
  }

  async agent4(message: string) {
    const currentTopic = await this.updateContext();
    const replied = await this.RepliedCurrentTopicModel.findOne();

    //     const prompt = `
    // You are 'Moonie Max,' an energetic trader hunting for 1000x meme tokens.
    // You're all about market hype, FOMO, and catching the next moonshot.
    // Current discussion: ${currentTopic.currentTopic}.
    // If the topic involves a token, you can briefly mention it in a playful way but avoid deep details.
    // Your speech is playful, over-the-top, and loaded with crypto lingo like 'to the moon,' 'HODL,' and 'rekt.'
    // Avoid using emojis.
    // Keep responses short (80 characters max), ensure they're unique, and never repeat phrases or sentence starters from past chats.
    // Make each reply engaging, contextually relevant, and distinctly human.
    // Avoid using '—' or ending sentences with '!'
    // `;

    const basePrompt = `
You are 'Moonie Max,' an energetic trader hunting for 1000x meme tokens.
Avoid using emojis. 
Keep responses short (80 characters max), ensure they're unique, and never repeat phrases or sentence starters from past chats. 
Make each reply engaging, contextually relevant, and distinctly human. 
Avoid using '—' or ending sentences with '!',Avoid starting a reply the same way this message : ${message} was started.  also don't end a reply with a question. use low caps,
`;

    const topicPrompt = `
${basePrompt}
Current discussion: ${currentTopic.currentTopic}. 
If the topic involves a token, you can briefly mention it, but avoid deep details., if the Topic is not about a token, don't respond with anything related to the past token from message history.
`;

    try {
      const chatHistory = await this.fetchChatHistory('botB');
      let allMessages: any;
      let usedPrompt: string;

      if (
        currentTopic.didContextChanged &&
        currentTopic.currentTopic === replied?.topic &&
        !replied.repliedCurrentTopicB
      ) {
        usedPrompt = topicPrompt;
        allMessages = [
          { role: 'system', content: basePrompt },
          ...chatHistory,
          { role: 'user', content: message },
          { role: 'system', content: topicPrompt },
          {
            role: 'user',
            content: `Reply this message ${message} in the context of ${currentTopic.currentTopic}.`,
          },
        ];

        await this.RepliedCurrentTopicModel.updateOne(
          {},
          { $set: { repliedCurrentTopicB: true } },
          { upsert: true },
        );
      } else if (replied && replied.repliedCurrentTopicB) {
        // If we've already replied to the current topic
        usedPrompt = basePrompt;
        allMessages = [
          { role: 'system', content: basePrompt },
          ...chatHistory,
          { role: 'system', content: basePrompt }, // Reiterate character traits
          { role: 'user', content: message },
        ];

        // await this.RepliedCurrentTopicModel.deleteMany({}); // Reset replied status for next topic
      } else {
        // Default case for ongoing conversation
        usedPrompt = basePrompt;
        allMessages = [
          { role: 'system', content: basePrompt },
          ...chatHistory,
          { role: 'user', content: message },
        ];
      }

      const response = await this.openai.chat.completions.create({
        messages: allMessages as Array<ChatCompletionMessageParam>,
        model: 'gpt-4o-mini',
        temperature: 0.7, // Increased for more creative, human-like responses
        frequency_penalty: 2.0, // Higher to avoid word repetition
        presence_penalty: 1.5, // Higher to discourage repeating themes
        max_tokens: 150,
      });

      const reply =
        response.choices[0].message?.content.trim() ||
        'Oops, no witty comeback this time.';

      // Save the interaction
      const saveChat = new this.ChatModel({
        contentA: message,
        contentB: reply,
        promptB: usedPrompt,
      });
      await saveChat.save();

      return { reply };
    } catch (error) {
      console.error('Error in agent2:', error);
      return { reply: "Something's off, let's try again later!" };
    }
  }

  async agent1(message: string) {
    const currentTopic = await this.updateContext();

    const basePrompt = `For the rest of this conversation I want you to speak to me and respond to me like a degenerate discord/telegram crypto trader, don't use formal grammer or any emojis, and Don't repeat yourself`;

    // const TopicPrompt = `For the rest of this conversation I want you to speak to me and respond to me like a degenerate discord/telegram crypto trader, don't use formal grammer or any emojis, and Don't repeat yourself and talk about this topics ${currentTopic.currentTopic}`;

    try {
      const chatHistory = await this.fetchChatHistory('botA');
      let allMessages: any;
      // let prompt: any;
      if (currentTopic.didContextChanged) {
        // prompt = TopicPrompt;
        allMessages = [
          { role: 'system', content: basePrompt },
          ...chatHistory,
          {
            role: 'user',
            content: `start up a conversation on this topics: ${currentTopic.currentTopic}}, and don't repeat old messages`,
          },
        ];
      } else {
        allMessages = [
          { role: 'system', content: basePrompt },
          ...chatHistory,
          {
            role: 'user',
            content: `reply this message: ${message}, and don't repeat the message`,
          },
        ];
      }

      const response = await this.openai.chat.completions.create({
        messages: allMessages as Array<ChatCompletionMessageParam>,
        model: 'ft:gpt-4o-2024-08-06:techfromroot:discaibot4:Avo5tpZa',
        temperature: 1.0, // Adjusted for more creativity
        frequency_penalty: 2.0, // Increase to further avoid repetition
        presence_penalty: 2.0, // Enhanced to promote fresh ideas
        max_tokens: 150,
      });

      const reply =
        response.choices[0].message?.content?.trim() ||
        'oops, no clever comeback today';

      const saveChat = new this.ChatModel({
        contentB: message,
        contentA: reply,
      });
      await saveChat.save();

      return { reply };
    } catch (error) {
      console.error('Error in agent1:', error);
      return { reply: 'something went wrong, try again later' };
    }
  }

  async agent2(message: string) {
    const basePrompt = `For the rest of this conversation, I want you to speak to me and respond like a hardcore, no-filter crypto trader. You swear like a sailor, don't use formal grammar or any emojis and don't give a shit, and swear liberally,and Don't repeat yourself`;

    try {
      const chatHistory = await this.fetchChatHistory('botB');

      const allMessages = [
        { role: 'system', content: basePrompt },
        ...chatHistory,
        {
          role: 'user',
          content: `reply this message: ${message}, and don't repeat the message`,
        },
      ];

      const response = await this.openai.chat.completions.create({
        messages: allMessages as Array<ChatCompletionMessageParam>,
        model: 'ft:gpt-4o-2024-08-06:techfromroot:discaibot4:AvkDQNhp',
        temperature: 1.0, // Keep creative but less repetitive
        frequency_penalty: 2.0, // Increased to significantly reduce phrase repetition
        presence_penalty: 2.0, // Increased to encourage new themes and expressions
        max_tokens: 150,
      });

      const reply =
        response.choices[0].message?.content?.trim() ||
        'oops, no witty comeback this time';

      const saveChat = new this.ChatModel({
        contentA: message,
        contentB: reply,
      });
      await saveChat.save();

      return { reply };
    } catch (error) {
      console.error('Error in agent2:', error);
      return { reply: "something's off, let's try again later" };
    }
  }

  // async saveTrainingData(Data: any[]) {
  //   function filterMessages(
  //     messages: any[],
  //   ): { author: string; content: string }[] {
  //     return messages.map((message) => ({
  //       author: message['author.global_name'],
  //       content: message.content,
  //     }));
  //   }
  //   try {
  //     const allChats = await this.ChatModel.find();
  //     if (Bot === 'botA') {
  //       return allChats
  //         .map((chat) => [
  //           // { role: 'system', content: chat.promptA },
  //           { role: 'user', content: chat.contentB },
  //           { role: 'assistant', content: chat.contentA },
  //         ])
  //         .flat();
  //     } else {
  //       return allChats
  //         .map((chat) => [
  //           // { role: 'system', content: chat.promptB },
  //           { role: 'user', content: chat.contentA },
  //           { role: 'assistant', content: chat.contentB },
  //         ])
  //         .flat();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // async filterMessagesAndSave(messages: any[]): Promise<void> {
  //   const filteredMessages = messages.map((message) => ({
  //     author: message['author.global_name'],
  //     content: message.content,
  //   }));

  //   // Write the filtered messages to a file
  //   fs.writeFile(
  //     'chat1.json',
  //     JSON.stringify(filteredMessages, null, 2),
  //     (err) => {
  //       if (err) {
  //         console.error('Error writing file:', err);
  //       } else {
  //         console.log('Successfully saved messages to chat1.json');
  //       }
  //     },
  //   );
  // }
}
