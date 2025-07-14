import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from '@workspace/sdk/constants/events';
import { allCaps } from '@workspace/sdk/utils/misc';

@Injectable()
export class DemoService {
  constructor(private readonly eventEmitter: EventEmitter2) { }
  //TODO: fix any
  helloWorld(rc: any) {
    this.eventEmitter.emit(EVENTS.DEMO.PING, 'Hello from WS', rc);
    return {
      message: allCaps('Hello') + ' from API',
      serverTime: new Date().toISOString(),
    };
  }
}
