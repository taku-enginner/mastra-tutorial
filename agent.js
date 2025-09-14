"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatAgent = void 0;
const core_1 = require("@mastra/core");
const tools_1 = require("./tools");
exports.chatAgent = (0, core_1.createAgent)({
    name: 'Chat Agent',
    description: 'ユーザーの質問に答えるAIエージェントです。',
    tools: [tools_1.getCurrentTime, tools_1.getWeather],
});
//# sourceMappingURL=agent.js.map