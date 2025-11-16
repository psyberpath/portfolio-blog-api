import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('email-queue')
export class NewsletterProcessor extends WorkerHost {
  constructor() {
    super();
  }
  async process(job: Job<any>, email?: string): Promise<any> {
    if (job.name === 'send-welcome-email') {
      console.log(`[Worker] Sending email to ${email}`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log(`[Worker] Email sent to ${email}`);
    }
  }
}
