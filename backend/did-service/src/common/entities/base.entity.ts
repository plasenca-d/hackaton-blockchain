import {
	Column,
	PrimaryGeneratedColumn,
	BaseEntity as TypeOrmBaseEntity,
} from "typeorm";

export abstract class BaseEntity extends TypeOrmBaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column("datetime", { default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date;

	@Column("datetime", { default: () => "CURRENT_TIMESTAMP" })
	updatedAt: Date;
}
