import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from 'src/modules/app/app.module';
import { FirebaseAuthGuard } from 'src/modules/auth/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new FirebaseAuthGuard(reflector));
  app.setGlobalPrefix('api/v1');

  const port = +(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
  console.log(`🚀  Listening on ${port}`);
}
bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
  process.exit(1);
});
