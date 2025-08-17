import { Column, Entity, Index } from 'typeorm';

@Entity()
@Index(['requestedAt', 'processor'])
@Index(['processor'])
export class Payments {
  @Column({ type: 'uuid', primary: true })
  correlationId: string;

  @Column()
  amount: number;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  requestedAt: Date;

  @Column({ type: 'enum', enum: ['default', 'fallback'], default: 'default' })
  processor: 'default' | 'fallback';
}
