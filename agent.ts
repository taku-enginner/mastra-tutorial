import { createAgent } from '@mastra/core';
import { getCurrentTime, getWeather } from './tools';

export const chatAgent = createAgent({
    name: 'Chat Agent',
    description: 'ユーザーの質問に答えるAIエージェントです。',
    tools: [getCurrentTime, getWeather],
});
