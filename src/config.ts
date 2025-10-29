import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`.env ${key} is not set`);
  }
  return value;
}

type Config = {
  api: APIConfig;
  db: DBConfig;
};

type APIConfig = {
  fileServerHits: number;
  port: number;
  platform: string;
  jwt: string;
  PolkaKey: string;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};


const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};


export const config: Config = {
  api: {
    fileServerHits: 0,
    port: Number(envOrThrow("PORT")),
    platform: envOrThrow("PLATFORM"),
    jwt: envOrThrow("JWT_SECRET"),
    PolkaKey:envOrThrow("POLKA_KEY")
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
};
