import { Job } from '../decorators/job.decorator';
import { AbstractJob } from './abstract.job';

@Job({
  name: 'Fibonacci',
  description: 'Generate fibonacci sequence and store in db',
})
export class FibonacciJob extends AbstractJob {}
