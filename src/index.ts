import { SQL } from "bun";
import {
	type CompiledQuery,
	type DatabaseConnection,
	type DatabaseIntrospector,
	type Dialect,
	type Driver,
	type Kysely,
	PostgresAdapter,
	PostgresIntrospector,
	PostgresQueryCompiler,
	type QueryCompiler,
	type QueryResult,
	type TransactionSettings,
} from "kysely";

export class PostgresDialect implements Dialect {
	#connectionString: string | URL;

	constructor(connectionString: string | URL) {
		this.#connectionString = connectionString;
	}

	createAdapter() {
		return new PostgresAdapter();
	}

	createDriver(): Driver {
		return new PostgresDriver(this.#connectionString);
	}

	createQueryCompiler(): QueryCompiler {
		return new PostgresQueryCompiler();
	}

	createIntrospector(db: Kysely<unknown>): DatabaseIntrospector {
		return new PostgresIntrospector(db);
	}
}

class PostgresDriver implements Driver {
	#client: SQL;

	constructor(config: string | URL) {
		this.#client = new SQL(config);
	}

	async init(): Promise<void> {
		await this.#client.connect();
	}

	async acquireConnection(): Promise<DatabaseConnection> {
		return new PostgresConnection(this.#client);
	}

	async beginTransaction(
		connection: PostgresConnection,
		settings: TransactionSettings,
	): Promise<void> {
		await connection.beginTransaction();
	}

	async commitTransaction(connection: PostgresConnection): Promise<void> {
		await connection.commitTransaction();
	}

	async rollbackTransaction(connection: PostgresConnection): Promise<void> {
		await connection.rollbackTransaction();
	}

	async releaseConnection(connection: PostgresConnection): Promise<void> {}

	async destroy(): Promise<void> {}
}

class PostgresConnection implements DatabaseConnection {
	#client: SQL;

	constructor(client: SQL) {
		this.#client = client;
	}

	async executeQuery<R>(compiledQuery: CompiledQuery): Promise<QueryResult<R>> {
		const rows = await this.#client(
			compiledQuery.sql,
			...compiledQuery.parameters,
		);

		return {
			rows: rows as R[],
		};
	}

	streamQuery<R>(
		compiledQuery: CompiledQuery,
		chunkSize?: number,
	): AsyncIterableIterator<QueryResult<R>> {
		throw new Error("Method not implemented.");
	}

	async beginTransaction(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async commitTransaction(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async rollbackTransaction(): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
