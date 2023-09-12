import mysql from "mysql";
export async function main() {
    const connection = mysql.createConnection({
        host: "localhost",
        port: 3386,
        user: "test",
        database: "test",
    });
    connection.ping()
    try {
        // const [rows, fields]: [Post[], FieldPacket[]] = await connection.query(
        //     "SELECT id, title, content FROM posts;"
        // );
        // rows.forEach((row) => {
        //     console.log('id: ', row.id, 'title', row.title, 'content: ', row.content)
        // });
        // fields.forEach((field) => {
        //     console.log('table: ', field.table);
        // });
    } catch (err) {
        console.log(err);
        throw err;
    }
}
