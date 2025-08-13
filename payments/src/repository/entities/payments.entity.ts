import { Column, Entity } from 'typeorm';

@Entity()
export class Payments {
  @Column({ type: 'uuid', primary: true })
  correlationId: string;

  @Column()
  amount: number;

  @Column({ type: 'timestamp' })
  requestedAt: Date;

  @Column({ type: 'enum', enum: ['default', 'fallback'], default: 'default' })
  processor: 'default' | 'fallback';
}
