import { NearBindgen, Vector, call, near, view } from "near-sdk-js";

@NearBindgen({})
class Registry {
	private records: Vector<string> = new Vector<string>("r");

	@call({})
	add_record({
		did1,
		hash,
		did2,
	}: {
		did1: string;
		hash: string;
		did2: string;
	}) {
		const entry = `${did1}-${hash}-${did2}`;
		this.records.push(entry);
		near.log(`Added record: ${entry}`);
	}

	@view({})
	get_records(): string[] {
		return this.records.toArray();
	}
}
