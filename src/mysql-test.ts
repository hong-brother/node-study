import { createConnection, RowDataPacket, FieldPacket } from "mysql2/promise";
import mysql from "mysql";
interface Post extends RowDataPacket {
    id: number;
    title: string;
    content: string;
}

async function main() {
    const connection = await createConnection({
        host: "localhost",
        port: 3386,
        user: "test",
        database: "test",
    });
    try {
        const [rows, fields]: [Post[], FieldPacket[]] = await connection.query(
            "SELECT id, title, content FROM posts;"
        );
        rows.forEach((row) => {
            console.log('id: ', row.id, 'title', row.title, 'content: ', row.content)
        });
        fields.forEach((field) => {
            console.log('table: ', field.table);
        });
    } catch (err) {
        throw err;
    }
}

main();
