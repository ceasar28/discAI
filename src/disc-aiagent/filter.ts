// import { data1 } from './trainingData/chat1';
// import { data2 } from './trainingData/chat2';
// import { data3 } from './trainingData/chat3';
// import { data4 } from './trainingData/chat4';
// import { data5 } from './trainingData/chat5';
// import * as fs from 'fs';
// import { trainnedData1 } from './trainingData/trainnedData1';
// import { trainnedData2 } from './trainingData/trainnedData2';
// import { trainnedData3 } from './trainingData/trainnedData3';
// import { trainnedData4 } from './trainingData/trainnedData4';
// import { trainnedData5 } from './trainingData/trainnedData5';

// function filterMessagesAndSave(messages: any): void {
//   const filteredMessages = messages.map((message) => ({
//     author: message['author.global_name'],
//     content: message.content,
//   }));

//   try {
//     fs.writeFileSync(
//       'src/disc-aiagent/trainingData/chat3Filtered.json',
//       JSON.stringify(filteredMessages, null, 2),
//     );
//     console.log('Successfully saved messages to chat1.json');
//   } catch (err) {
//     console.error('Error writing file:', err);
//   }
// }

// function formatChatHistory1(
//   messages: any[],
// ): { role: string; content: string }[] {
//   const formattedMessages: { role: string; content: string }[] = [];

//   messages.forEach((message, index) => {
//     const role = index % 2 === 0 ? 'user' : 'assistant';
//     formattedMessages.push({ role, content: message.content });
//   });

//   try {
//     fs.writeFileSync(
//       'src/disc-aiagent/trainingData/trainned.json',
//       JSON.stringify(formattedMessages, null, 2),
//     );
//     console.log('Successfully saved messages to chat1.json');

//     return formattedMessages;
//   } catch (err) {
//     console.error('Error writing file:', err);
//   }
// }

// function formatChatHistory2(
//   messages: any[],
// ): { role: string; content: string }[] {
//   const formattedMessages: { role: string; content: string }[] = [];

//   messages.forEach((message, index) => {
//     if (!message.content) return; // Skip if content is empty or null

//     const role = formattedMessages.length % 2 === 0 ? 'user' : 'assistant';
//     formattedMessages.push({ role, content: message.content });
//   });

//   try {
//     fs.writeFileSync(
//       'src/disc-aiagent/trainingData/trainned2.json',
//       JSON.stringify(formattedMessages, null, 2),
//     );
//     console.log('Successfully saved messages to chat1.json');

//     return formattedMessages;
//   } catch (err) {
//     console.error('Error writing file:', err);
//   }
// }

// // strips empty messages and turn numbers to string
// function formatChatHistory(
//   messages: any[],
// ): { role: string; content: string }[] {
//   const formattedMessages: { role: string; content: string }[] = [];

//   messages.forEach((message) => {
//     if (message.content === null || message.content === '') return; // Skip empty or null content

//     const content =
//       typeof message.content === 'number'
//         ? message.content.toString()
//         : message.content;
//     const role = formattedMessages.length % 2 === 0 ? 'user' : 'assistant';

//     formattedMessages.push({ role, content });
//   });
//   try {
//     fs.writeFileSync(
//       'src/disc-aiagent/trainingData/trainned5.json',
//       JSON.stringify(formattedMessages, null, 2),
//     );
//     console.log('Successfully saved messages to chat1.json');

//     return formattedMessages;
//   } catch (err) {
//     console.error('Error writing file:', err);
//   }
// }

// // function convertToJSONL(
// //   conversations: { role: string; content: string }[][],
// //   filePath: string,
// // ) {
// //   const systemMessage = {
// //     role: 'system',
// //     content: `You are 'Degen Dan,' a reckless crypto trader with a love for high-risk, high-reward moves.
// // Your style is chaotic, humorous, and packed with crypto jargon.Craft unique responses, avoiding repetition of phrases or structures from past interactions.
// // Keep responses concise (80 characters max), no '!' or '—' at ends,Use lowercase for all text.
// // `,
// //   };

// //   const jsonlData = conversations
// //     .map((chatArray) =>
// //       JSON.stringify({ messages: [systemMessage, ...chatArray] }),
// //     )
// //     .join('\n');

// //   fs.writeFileSync(filePath, jsonlData, 'utf8');
// // }

// function convertToJSONL(
//   conversations: { role: string; content: any }[][],
//   filePath: string,
// ) {
//   const systemMessage = {
//     role: 'system',
//     content: `You are 'Degen Dan,' a reckless crypto trader with a love for high-risk, high-reward moves.
// Your style is chaotic, humorous, and packed with crypto jargon.Craft unique responses, avoiding repetition of phrases or structures from past interactions.
// Keep responses concise (100 characters max), no '!' or '—' at ends,Use lowercase for all text.
// `,
//   };

//   const jsonlData = conversations
//     .flatMap((chatArray) => {
//       const filteredMessages = chatArray
//         .filter((msg) => msg.content !== null && msg.content !== '') // Skip empty/null messages
//         .map((msg) => ({
//           role: msg.role,
//           content:
//             typeof msg.content === 'number' ? String(msg.content) : msg.content, // Convert numbers to strings
//         }));

//       const jsonlEntries: string[] = [];

//       // Group messages into user-assistant pairs
//       for (let i = 0; i < filteredMessages.length - 1; i++) {
//         if (
//           filteredMessages[i].role === 'user' &&
//           filteredMessages[i + 1].role === 'assistant'
//         ) {
//           jsonlEntries.push(
//             JSON.stringify({
//               messages: [
//                 systemMessage,
//                 filteredMessages[i],
//                 filteredMessages[i + 1],
//               ],
//             }),
//           );
//           i++; // Skip the next message since it's already paired
//         }
//       }

//       return jsonlEntries;
//     })
//     .join('\n');

//   fs.writeFileSync(filePath, jsonlData, 'utf8');
// }

// // filterMessagesAndSave(data4);
// // formatChatHistory(data5);

// convertToJSONL([trainnedData1], `discaiBot.jsonl`);

// {"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of France?"}, {"role": "assistant", "content": "Paris, as if everyone doesn't know that already."}]}
