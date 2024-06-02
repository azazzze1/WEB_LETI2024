import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SocketService } from './socket.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [SocketService],
})
export class AppModule {}
