import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Producer } from 'pulsar-client';

@Injectable()
export class PulsarClient implements OnModuleDestroy {
  private readonly client = new Client({
    serviceUrl: this.configService.getOrThrow('PULSAR_SERVICE_URL'),
  });
  private readonly producers: Producer[] = [];

  constructor(private readonly configService: ConfigService) {}

  async createProducer(topic: string) {
    const producer = await this.client.createProducer({
      topic,
    });
    this.producers.push(producer);
    return producer;
  }

  async onModuleDestroy() {
    for (const producer of this.producers) {
      await producer.close();
    }
    await this.client.close();
  }
}
