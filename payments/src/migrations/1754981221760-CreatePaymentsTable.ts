import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentsTable1754981221760 implements MigrationInterface {
  name = 'CreatePaymentsTable1754981221760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payments" ("correlationId" uuid NOT NULL, "amount" integer NOT NULL, "requestedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_9965e60c5cd2b29271b36657bd2" PRIMARY KEY ("correlationId"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payments"`);
  }
}
