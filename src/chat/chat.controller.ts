import { Controller, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get()
    async getChatResponse(@Query('question') message: string) {
        if (!message) {
            return { error: 'Message query parameter is required' };
        }
        return await this.chatService.createChat(message);
    }
}
