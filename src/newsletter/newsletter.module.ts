import { Module } from '@nestjs/common';
import { NewsletterController } from './newsletter.controller';
import { BullModule } from '@nestjs/bullmq';
import { NewsletterProcessor } from './newsletter.processor';
import { NewsletterService } from './newsletter.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email-queue',
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      },
    }),
  ],
  controllers: [NewsletterController],
  providers: [NewsletterService, NewsletterProcessor],
})
export class NewsletterModule {}
