import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

declare const module: any;

async function bootstrap() {
  console.log(__dirname);
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('demo shop')
    .setDescription('demo shop API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('document', app, document);

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
