import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import {
  AuthsModule,
  RSUserModule,
  RolesModule,
  UsersModule,
} from '@rumsan/user';
import { DemoModule } from 'src/demo/demo.module';
import { GrievanceModule } from 'src/grievance/grievance.module';
import { QueueModule } from 'src/queue/queue.module';
import { ListenerModule } from '../listeners/listener.module';
import { AppUsersModule } from '../vendors/vendors.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebSocketService } from './websocket.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot({
      maxListeners: 10,
      ignoreErrors: false,
    }),
    DemoModule,
    ListenerModule,
    RSUserModule.forRoot([AuthsModule, UsersModule, RolesModule]),
    GrievanceModule,
    AppUsersModule,
    QueueModule
  ],
  controllers: [AppController],
  providers: [AppService, WebSocketService],
})
export class AppModule { }
