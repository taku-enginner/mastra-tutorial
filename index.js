"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agent_1 = require("./agent");
async function main() {
    // 質問１：時間に関する質問
    const res1 = await agent_1.chatAgent.chat('今の日本時間を教えてください。');
    console.log(`質問1: ${res1.content}`);
    // 質問２：天気に関する質問
    const res2 = await agent_1.chatAgent.chat('大阪の天気はどうですか？');
    console.log(`質問2: ${res2.content}`);
    // 質問３：ツールを使わない質問
    const res3 = await agent_1.chatAgent.chat('Mastraについて教えてください。');
    console.log(`質問3: ${res3.content}`);
}
main();
//# sourceMappingURL=index.js.map