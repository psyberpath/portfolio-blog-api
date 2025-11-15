import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NewsletterService {
  constructor(@InjectQueue('email-queue') private emailQueue: Queue) {}

  async subscribe(email: string) {
    const job = await this.emailQueue.add('send-welcome-email', {
      email: email,
      timestamp: new Date(),
    });
    return { jobId: job.id };
  }
}
