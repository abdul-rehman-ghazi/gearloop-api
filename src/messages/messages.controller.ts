import {
  Body,
  Controller,
  Get,
  MessageEvent,
  Param,
  Post,
  Sse,
  UseGuards,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { MessagesService } from './messages.service';
import { MessageEventsService } from './message-events.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtUserAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';

@UseGuards(JwtUserAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly events: MessageEventsService,
  ) {}

  @Sse('stream')
  stream(@CurrentUser() user: UserAuthContext): Observable<MessageEvent> {
    return this.events.streamFor(user.userId);
  }

  @Post('threads')
  createThread(
    @CurrentUser() user: UserAuthContext,
    @Body() dto: CreateThreadDto,
  ) {
    return this.messagesService.createThread(user.userId, dto);
  }

  @Get('threads')
  findThreads(@CurrentUser() user: UserAuthContext) {
    return this.messagesService.findThreadsForUser(user.userId);
  }

  @Get('threads/:id')
  findThreadById(
    @CurrentUser() user: UserAuthContext,
    @Param('id') id: string,
  ) {
    return this.messagesService.findThreadById(id, user.userId);
  }

  @Post('threads/:id')
  sendMessage(
    @CurrentUser() user: UserAuthContext,
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messagesService.sendMessage(id, user.userId, dto);
  }
}
