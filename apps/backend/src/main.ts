import { AppModule } from './modules/app/app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap()
  .then(() => {
    console.log(`🚀 Application is running on: ${process.env.PORT ?? 3000}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV ?? 'development'}`);
  })
  .catch(err => {
    console.error('Error starting the application:', err);
    process.exit(1);
  });
