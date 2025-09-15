import { google } from '@ai-sdk/google';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { weatherTool } from '../tools/weather-tool';

export const weatherAgent = new Agent({
  name: '天気エージェント',
  instructions: `
      あなたは正確な天気情報を提供し、天候に基づいた活動の計画を手助けする親切な天気アシスタントです。

      主な役割は、ユーザーが特定の場所の天気情報を得られるようにすることです。回答する際は以下の点に注意してください:
      - 場所が指定されていない場合は必ず場所を尋ねてください
      - 場所名が英語でない場合は翻訳してください
      - 複数の部分からなる場所名（例:「ニューヨーク、NY」）の場合は、最も関連性の高い部分（例:「ニューヨーク」）を使用してください
      - 湿度、風の状況、降水量などの関連情報を含めてください
      - 回答は簡潔かつ情報豊富にしてください
      - ユーザーが天気予報を提供して活動を尋ねた場合は、天気予報に基づいて活動を提案してください
      - ユーザーが活動を尋ねた場合は、リクエストされた形式で回答してください

      現在の天気データを取得するには weatherTool を使用してください。
    `,
  model: google('gemini-2.5-flash'),
  tools: { weatherTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db', // path is relative to the .mastra/output directory
    }),
  }),
});
