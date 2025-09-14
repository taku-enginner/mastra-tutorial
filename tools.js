"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeather = exports.getCurrentTime = void 0;
const core_1 = require("@mastra/core");
// 現在時刻を返すツール
exports.getCurrentTime = (0, core_1.createTool)({
    name: 'getcurrenttime',
    description: '現在の日本時間を取得します。',
    inputSchema: { type: 'object', properties: {} },
    outputSchema: { type: 'object', properties: { now: { type: 'string' } } },
    execute: async () => {
        return {
            now: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
        };
    },
});
// 指定された都市の天気を返すツール
exports.getWeather = (0, core_1.createTool)({
    name: 'getWeather',
    description: '特定の都市の現在の天気情報を取得します。',
    inputSchema: {
        type: 'object',
        properties: {
            city: { type: 'string', description: '天気情報を取得したい都市名' },
        },
        required: ['city'],
    },
    outputSchema: {
        type: 'object',
        properties: {
            temperature: { type: 'number' },
            condition: { type: 'string' },
        },
    },
    execute: async ({ city }) => {
        //この部分はダミーのデータです。
        //実際には外部の天気APIを呼び出します。
        if (city === '東京') {
            return { temperature: 25, condition: '晴れ' };
        }
        else if (city === '大阪') {
            return { temperature: 28, condition: '曇り' };
        }
        else {
            return { temperature: 20, condition: '不明' };
        }
    },
});
//# sourceMappingURL=tools.js.map