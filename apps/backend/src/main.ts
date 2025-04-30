import { Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';
import { AppModule } from 'src/modules/app/app.module';
import { FirebaseAuthGuard } from 'src/modules/auth/auth.guard';

const logger = new Logger('TaskChain API');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new FirebaseAuthGuard(reflector));
  app.setGlobalPrefix('api/v1');
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.log(`Request: ${req.method} ${req.url}`);
    next();
  });

  const port = +(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀  Listening on ${port}`);
}
bootstrap().catch((err) => {
  logger.error('Error starting the application:', err);
  process.exit(1);
});
