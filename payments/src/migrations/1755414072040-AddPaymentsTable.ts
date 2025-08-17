import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentsTable1755414072040 implements MigrationInterface {
  name = 'AddPaymentsTable1755414072040';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."payments_processor_enum" AS ENUM('default', 'fallback')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payments" ("correlationId" uuid NOT NULL, "amount" integer NOT NULL, "requestedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "processor" "public"."payments_processor_enum" NOT NULL DEFAULT 'default', CONSTRAINT "PK_9965e60c5cd2b29271b36657bd2" PRIMARY KEY ("correlationId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ac68db3631246ab1cd9b6d3900" ON "payments" ("processor") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0a7180c85368174a61c3192e7b" ON "payments" ("requestedAt", "processor") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0a7180c85368174a61c3192e7b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ac68db3631246ab1cd9b6d3900"`,
    );
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TYPE "public"."payments_processor_enum"`);
  }
}
