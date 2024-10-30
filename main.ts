// main.ts

import { CortexAPI, CreateAssistantDto, CreateChatCompletionDto, ChatCompletionMessage, PullModelRequest, ModelStartDto } from './cortex.ts';
import { agents } from './agents.ts';

(async () => {
    const cortex = new CortexAPI();

    const engines = await cortex.listEngines();
    const llamaEngine = engines.data.find(engine => engine.name === 'llama-cpp');

    if (llamaEngine?.status !== 'Ready') {
        const installResp = await cortex.installEngine('llama-cpp');
        console.log(installResp.message);
    }

    const modelId = 'gguf-model';
    const modelUrl = '10.10.0.139:8000/LLAMA-3_8B_Unaligned_BETA-Q6_K.gguf';

    const models = await cortex.listModels();
    const modelExists = models.data.some(model => model.id === modelId);

    if (!modelExists) {
        const pullModelData: PullModelRequest = { model: modelUrl };
        const pullResponse = await cortex.pullModel(pullModelData);
        console.log(pullResponse.message);

        let modelReady = false;
        while (!modelReady) {
            const currentModels = await cortex.listModels();
            modelReady = currentModels.data.some(model => model.id === modelId);
            if (!modelReady) {
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        }
    }

    const startModelData: ModelStartDto = { model: modelId };
    const startResponse = await cortex.startModel(startModelData);
    console.log(startResponse.message);

    for (const agent of agents) {
        const assistantData: CreateAssistantDto = {
            id: agent.id,
            name: agent.name,
            description: agent.description,
            model: modelId,
            instructions: agent.instructions,
            tools: [],
            metadata: null,
            avatar: '',
            temperature: agent.temperature,
            top_p: agent.top_p,
        };
        await cortex.createAssistant(assistantData);
    }

    const assistantId = 'interviewer';
    const assistant = agents.find(a => a.id === assistantId);
    if (!assistant) return;

    const messages: ChatCompletionMessage[] = [
        { role: 'system', content: assistant.instructions },
        { role: 'user', content: 'Hello, can you tell me about yourself?' }
    ];

    const chatCompletionData: CreateChatCompletionDto = {
        model: modelId,
        messages: messages,
        temperature: assistant.temperature,
        top_p: assistant.top_p,
    };

    const response = await cortex.createChatCompletion(chatCompletionData);
    console.log(response.choices[0].message.content);
})();
