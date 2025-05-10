import { PulsarClient } from '@jobber/pulsar';
import { Job } from '../decorators/job.decorator';
import { AbstractJob } from './abstract.job';
import { FibonacciData } from './fibonacci-data.message';

@Job({
  name: 'Fibonacci',
  description: 'Generate fibonacci sequence and store in db',
})
export class FibonacciJob extends AbstractJob<FibonacciData> {
  protected messageClass = FibonacciData;

  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient);
  }
}
