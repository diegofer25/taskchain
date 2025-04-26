import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/modules/app/app.module';
import { FirebaseAuthGuard } from 'src/modules/auth/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalGuards(new FirebaseAuthGuard());

  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap()
  .then(() => {
    console.log(`🚀 Application is running on: ${process.env.PORT ?? 3000}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV ?? 'development'}`);
  })
  .catch((err) => {
    console.error('Error starting the application:', err);
    process.exit(1);
  });
