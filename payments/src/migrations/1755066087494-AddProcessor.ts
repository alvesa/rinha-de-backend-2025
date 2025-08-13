import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProcessor1755066087494 implements MigrationInterface {
  name = 'AddProcessor1755066087494';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."payments_processor_enum" AS ENUM('default', 'fallback')`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "processor" "public"."payments_processor_enum" NOT NULL DEFAULT 'default'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "processor"`);
    await queryRunner.query(`DROP TYPE "public"."payments_processor_enum"`);
  }
}
