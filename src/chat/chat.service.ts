import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { randomUUID } from 'node:crypto';

@Injectable()
export class ChatService {
    private openai: OpenAI;
    private OPENAI_API_KEY: string;
    private logger = new Logger(ChatService.name);

    constructor(private configService: ConfigService) {
        this.OPENAI_API_KEY =
            this.configService.getOrThrow<string>('OPENAI_API_KEY');
        this.openai = new OpenAI({
            apiKey: this.OPENAI_API_KEY,
        } as any);

        this.logger.debug(`OpenAI service initialized successfully.`);
    }

    async createChat(message: string) {
        const request_id = randomUUID();

        this.logger.debug(
            `Creating chat stream for message: ${JSON.stringify({ body: { message }, request_id })}`,
        );

        const stream = await this.openai.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [{ role: 'user', content: message }],
            stream: true,
        });

        let response = '';
        for await (const chunk of stream) {
            if (chunk.choices?.length && chunk.choices[0].delta?.content) {
                response += chunk.choices[0].delta.content;
            }
        }

        this.logger.debug(`Chat stream ended for request ID: ${request_id}`);

        return { response };
    }
}
