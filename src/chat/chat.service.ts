import { Injectable, Logger, NotAcceptableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { randomUUID } from 'node:crypto';

@Injectable()
export class ChatService {
    private openai: OpenAI;
    private OPENAI_API_KEY: string;
    private OPENAI_ENABLED: string;
    private logger = new Logger(ChatService.name);

    constructor(private configService: ConfigService) {
        this.OPENAI_ENABLED = this.configService.get('OPENAI_ENABLED', 'false');
        if (this.OPENAI_ENABLED == 'true') {
            this.OPENAI_API_KEY =
                this.configService.getOrThrow<string>('OPENAI_API_KEY');
            this.openai = new OpenAI({
                apiKey: this.OPENAI_API_KEY,
            } as any);

            this.logger.debug(`OpenAI service initialized successfully.`);
        } else {
            this.logger.debug(`OpenAI service not initialized!`);
        }
    }

    async createChat(message: string) {
        if (this.OPENAI_ENABLED == 'false')
            throw new NotAcceptableException('Openai Disabled!');
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
