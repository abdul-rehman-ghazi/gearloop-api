import { Injectable, MessageEvent } from '@nestjs/common';
import { Observable, Subject, filter, interval, map, merge } from 'rxjs';

interface ThreadPing {
  userId: string;
  threadId: string;
}

@Injectable()
export class MessageEventsService {
  // ponytail: in-process bus, single instance only. Move to Redis pub/sub
  // if the API ever runs more than one replica.
  private readonly stream$ = new Subject<ThreadPing>();

  emit(userId: string, threadId: string) {
    this.stream$.next({ userId, threadId });
  }

  streamFor(userId: string): Observable<MessageEvent> {
    const messages$ = this.stream$.pipe(
      filter((e) => e.userId === userId),
      map((e): MessageEvent => ({ data: { threadId: e.threadId } })),
    );
    // Keepalive so idle proxies don't drop the connection.
    const keepalive$ = interval(25000).pipe(
      map((): MessageEvent => ({ data: { type: 'ping' } })),
    );
    return merge(messages$, keepalive$);
  }
}
