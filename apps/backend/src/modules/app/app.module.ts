import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from 'src/modules/app/app.controller';
import { AppService } from 'src/modules/app/app.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TasksModule } from 'src/modules/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    AuthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
