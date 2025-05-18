import { type MigrationInterface, type QueryRunner, Table } from "typeorm";

export class Verify1712423429712 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "verify",
				columns: [
					{
						name: "id",
						type: "varchar",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "uuid",
					},
					{
						name: "name",
						type: "varchar",
						isNullable: false,
					},
					{
						name: "email",
						type: "varchar",
						isNullable: false,
					},
					{
						name: "did",
						type: "varchar",
						isNullable: false,
					},
					{
						name: "vpHash",
						type: "varchar",
						isNullable: false,
					},
					{
						name: "verified",
						type: "boolean",
						default: false,
						isNullable: false,
					},
					{
						name: "createdAt",
						type: "DATETIME",
						default: "CURRENT_TIMESTAMP",
						isNullable: false,
					},
					{
						name: "updatedAt",
						type: "DATETIME",
						default: "CURRENT_TIMESTAMP",
						isNullable: false,
					},
				],
			}),
			true,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("verify", true);
	}
}
