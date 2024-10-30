// cortex.ts

export interface AssistantEntity {
    id: string;
    object: string;
    created_at: number;
    name: string | null;
    description: string | null;
    model: string;
    instructions: string | null;
    tools: object;
    metadata: object | null;
    top_p: number | null;
    temperature: number | null;
    response_format: object | null;
    tool_resources: object | null;
    avatar: string;
}

export interface CreateAssistantDto {
    id: string;
    name: string;
    description: string;
    model: string;
    instructions: string;
    tools: any[];
    metadata: object | null;
    avatar?: string;
    temperature?: number;
    top_p?: number;
}

export interface DeleteAssistantResponseDto {
    id: string;
    object: string;
    deleted: boolean;
}

export interface ChatCompletionMessage {
    role: string;
    content: string;
}

export interface CreateChatCompletionDto {
    messages: ChatCompletionMessage[];
    model: string;
    frequency_penalty?: number;
    max_tokens?: number;
    presence_penalty?: number;
    stop?: string[];
    stream?: boolean;
    temperature?: number;
    top_p?: number;
}

export interface ChoiceDto {
    index: number;
    message: MessageDto;
    finish_reason: string;
}

export interface MessageDto {
    role: string;
    content: string;
}

export interface UsageDto {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}

export interface ChatCompletionResponseDto {
    id: string;
    object: string;
    created: number;
    model: string;
    system_fingerprint: string;
    choices: ChoiceDto[];
    usage: UsageDto;
}

export interface ListModelsResponseDto {
    object: string;
    data: ModelDto[];
}

export interface ModelDto {
    id: string;
    cache_type?: string;
    caching_enabled?: boolean;
    cpu_threads?: number;
    ctx_len?: number;
    engine?: string;
    flash_attn?: boolean;
    frequency_penalty?: number;
    grammar_file?: string;
    grp_attn_n?: number;
    grp_attn_w?: number;
    max_tokens?: number;
    mlock?: boolean;
    n_batch?: number;
    ngl?: number;
    pre_prompt?: string;
    presence_penalty?: number;
    prompt_template?: string;
    stop?: string[];
    stream?: boolean;
    temperature?: number;
    top_p?: number;
    use_mmap?: boolean;
}

export interface DeleteModelResponseDto {
    id: string;
    object: string;
    deleted: boolean;
}

export interface PullModelRequest {
    id?: string;
    model: string;
}

export interface PullModelResponse {
    message: string;
    task?: any;
}

export interface ModelStartDto {
    model: string;
}

export interface StartModelSuccessDto {
    message: string;
    modelId: string;
}

export interface CreateThreadAssistantDto {
    id: string;
    name: string;
    model: string;
    instructions: string;
    tools: any[];
    description: string;
    metadata: object | null;
    object: string;
    created_at: number;
    avatar?: string;
    temperature?: number;
    top_p?: number;
    response_format?: object;
    tool_resources?: object;
}

export interface CreateThreadDto {
    assistants: CreateThreadAssistantDto[];
}

export interface DeleteThreadResponseDto {
    id: string;
    object: string;
    deleted: boolean;
}

export interface GetThreadResponseDto {
    id: string;
    object: string;
    created_at: number;
    assistants: string[];
    messages: string[];
    metadata: object;
}

export interface CreateMessageDto {
    role: string;
    content: string;
}

export interface DeleteMessageDto {
    id: string;
    object: string;
    deleted: boolean;
}

export interface ListMessagesResponseDto {
    object: string;
    data: ListMessageObjectDto[];
    first_id: string;
    last_id: string;
    has_more: boolean;
}

export interface ListMessageObjectDto {
    id: string;
    object: string;
    created_at: number;
    thread_id: string;
    role: string;
    file_ids: string[];
    assistant_id: string | null;
    run_id: string | null;
    metadata: object;
}

export interface GetMessageResponseDto {
    id: string;
    object: string;
    created_at: number;
    thread_id: string;
    role: string;
    content: ContentDto[];
    file_ids: string[];
    assistant_id: string | null;
    run_id: string | null;
    metadata: object;
}

export interface ContentDto {
    type: string;
    text: {
        annotations: any[];
        value: string;
    };
}

export interface EngineList {
    object: string;
    data: Engine[];
    result: string;
}

export interface Engine {
    description: string;
    name: string;
    productName: string;
    status: string;
    variant: string;
    version: string;
}

export interface EngineInstallationResponseDto {
    message: string;
}

export interface EngineUninstallationResponseDto {
    message: string;
}

export class CortexAPI {
    private baseUrl: string;
    private state: any;

    constructor(baseUrl: string = 'http://127.0.0.1:39281') {
        this.baseUrl = baseUrl;
        this.state = {};
    }

    async listAssistants(): Promise<AssistantEntity[]> {
        const response = await fetch(`${this.baseUrl}/v1/assistants`, {
            method: 'GET'
        });
        return response.json();
    }

    async createAssistant(data: CreateAssistantDto): Promise<void> {
        await fetch(`${this.baseUrl}/v1/assistants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    async getAssistant(id: string): Promise<AssistantEntity> {
        const response = await fetch(`${this.baseUrl}/v1/assistants/${id}`, {
            method: 'GET'
        });
        return response.json();
    }

    async deleteAssistant(id: string): Promise<DeleteAssistantResponseDto> {
        const response = await fetch(`${this.baseUrl}/v1/assistants/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    }

    async createChatCompletion(data: CreateChatCompletionDto): Promise<ChatCompletionResponseDto> {
        const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    async listModels(): Promise<ListModelsResponseDto> {
        const response = await fetch(`${this.baseUrl}/v1/models`, {
            method: 'GET'
        });
        return response.json();
    }

    async getModel(id: string): Promise<ModelDto> {
        const response = await fetch(`${this.baseUrl}/v1/models/${id}`, {
            method: 'GET'
        });
        return response.json();
    }

    async deleteModel(id: string): Promise<DeleteModelResponseDto> {
        const response = await fetch(`${this.baseUrl}/v1/models/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    }

    async pullModel(data: PullModelRequest): Promise<PullModelResponse> {
        const response = await fetch(`${this.baseUrl}/v1/models/pull`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    async startModel(data: ModelStartDto): Promise<StartModelSuccessDto> {
        const response = await fetch(`${this.baseUrl}/v1/models/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    async stopModel(data: ModelStartDto): Promise<StartModelSuccessDto> {
        const response = await fetch(`${this.baseUrl}/v1/models/stop`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    async listThreads(): Promise<any[]> {
        const response = await fetch(`${this.baseUrl}/v1/threads`, {
            method: 'GET'
        });
        return response.json();
    }

    async createThread(data: CreateThreadDto): Promise<void> {
        await fetch(`${this.baseUrl}/v1/threads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    async deleteThread(threadId: string): Promise<DeleteThreadResponseDto> {
        const response = await fetch(`${this.baseUrl}/v1/threads/${threadId}`, {
            method: 'DELETE'
        });
        return response.json();
    }

    async getThread(threadId: string): Promise<GetThreadResponseDto> {
        const response = await fetch(`${this.baseUrl}/v1/threads/${threadId}`, {
            method: 'GET'
        });
        return response.json();
    }

    async createMessageInThread(threadId: string, data: CreateMessageDto): Promise<void> {
        await fetch(`${this.baseUrl}/v1/threads/${threadId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    async listMessagesInThread(threadId: string): Promise<ListMessagesResponseDto> {
        const response = await fetch(`${this.baseUrl}/v1/threads/${threadId}/messages`, {
            method: 'GET'
        });
        return response.json();
    }

    async getMessage(threadId: string, messageId: string): Promise<GetMessageResponseDto> {
        const response = await fetch(`${this.baseUrl}/v1/threads/${threadId}/messages/${messageId}`, {
            method: 'GET'
        });
        return response.json();
    }

    async deleteMessage(threadId: string, messageId: string): Promise<DeleteMessageDto> {
        const response = await fetch(`${this.baseUrl}/v1/threads/${threadId}/messages/${messageId}`, {
            method: 'DELETE'
        });
        return response.json();
    }

    async getSystemStatus(): Promise<any> {
        const response = await fetch(`${this.baseUrl}/v1/system`, {
            method: 'GET'
        });
        return response.json();
    }

    async stopApiServer(): Promise<void> {
        await fetch(`${this.baseUrl}/v1/system`, {
            method: 'DELETE'
        });
    }

    async listEngines(): Promise<EngineList> {
        const response = await fetch(`${this.baseUrl}/v1/engines`, {
            method: 'GET'
        });
        return response.json();
    }

    async getEngine(name: string): Promise<Engine> {
        const response = await fetch(`${this.baseUrl}/v1/engines/${name}`, {
            method: 'GET'
        });
        return response.json();
    }

    async installEngine(name: string): Promise<EngineInstallationResponseDto> {
        const response = await fetch(`${this.baseUrl}/v1/engines/install/${name}`, {
            method: 'POST'
        });
        return response.json();
    }

    async uninstallEngine(name: string): Promise<EngineUninstallationResponseDto> {
        const response = await fetch(`${this.baseUrl}/v1/engines/install/${name}`, {
            method: 'DELETE'
        });
        return response.json();
    }
}
