import { Module } from '@nestjs/common';
import { NewsletterController } from './newsletter.controller';
import { BullModule } from '@nestjs/bullmq';
import { NewsletterProcessor } from './newsletter.processor';
import { NewsletterService } from './newsletter.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email-queue',
    }),
  ],
  controllers: [NewsletterController],
  providers: [NewsletterService, NewsletterProcessor],
})
export class NewsletterModule {}
