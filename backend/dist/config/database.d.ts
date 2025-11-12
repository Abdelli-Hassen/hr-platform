import mysql from "mysql2/promise";
export declare const pool: mysql.Pool;
export declare const query: (sql: string, values?: any[]) => Promise<[mysql.QueryResult, mysql.FieldPacket[]]>;
//# sourceMappingURL=database.d.ts.map