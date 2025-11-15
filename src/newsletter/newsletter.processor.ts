import { Processor, WorkerHost } from '@nestjs/bullmq';

@Processor('email-queue')
export class NewsletterProcessor {}
