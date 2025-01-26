import { describe, expect, test } from "bun:test";
import { PostgresDialect } from ".";
import { Kysely, sql } from "kysely";

describe("PostgresDialect", () => {
	// biome-ignore lint/suspicious/noExplicitAny: Any type for unit testing
	const db = new Kysely<any>({
		dialect: new PostgresDialect(
			`postgres://${Bun.env.POSTGRES_USER}:${Bun.env.POSTGRES_PASSWORD}@localhost:5432/postgres`,
		),
	});

	test("should instantiate properly", () => {
		const dialect = new PostgresDialect(
			`postgres://${Bun.env.POSTGRES_USER}:${Bun.env.POSTGRES_PASSWORD}@localhost:5432/postgres`,
		);
		expect(dialect).toBeDefined();
	});

	test("should be a valid adapter", () => {
		expect(db).toBeDefined();
	});

	test("should work for schemaless select", async () => {
		const result = await db.executeQuery(sql`SELECT 1 AS "one"`.compile(db));
		expect(result.rows).toEqual([{ one: 1 }]);
	});

	test("it should work for schemaful selects", async () => {
		const result = await db
			.selectFrom("pg_database")
			.select("datname")
			.where("datname", "=", "postgres")
			.executeTakeFirst();
		expect(result?.datname).toEqual("postgres");
	});

	test.todo("it should work for transactions", async () => {
		await db.transaction().execute(async (t) => {
			await t.executeQuery(sql`SELECT 1 AS "one"`.compile(db));
			await t.executeQuery(sql`SELECT 2 AS "two"`.compile(db));
		});
	});
});
