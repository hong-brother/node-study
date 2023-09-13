import mysql from "mysql2/promise";

/**
 * 동시성 테스트
 * https://dololak.tistory.com/446
 * [SELECT ~ FOR UPDATE]
 * 하나 또는 특정 범위의 row에 대해 여러 세션에서 접근하여 발생할 수 있는 동시성 문제를 해결하기 위해 이용
 * 조회 된 Row에 대해서는 Transaction이 종료(commit, rollback)될 때 까지 CRUD가 모두 차단도니다.
 * [ISSUE]
 *  - deadlock
 *      데이터 수가 0개인 테이블에 대해 여러 세션에서 SELECT FOR UPDATE를 실행 시키면 모든 세선에서 INSERT 실행 시킬 수 없다.
 *  - 성능저하
 *      for update 사용시 다른 트랜잭션에서 해당 행을 수정하지 못하게 되므로 성능 저하 발생
 */
const dbConfig = {
    host: "localhost",
    port: 3307,
    user: "test",
    password: "test",
    database: "test",
};

export async function concurrency() {
    // 데이터베이스 연결
    const connection = await mysql.createConnection(dbConfig);
    try {
        // 트랜잭션 시작
        await connection.beginTransaction();

        const selectQuery: string =
            `SELECT cnb_id, login_id, device_id, site_id, created_at, modified_at FROM test.unique_users order by cnb_id`;
        const [rows, fields] = await connection.execute(selectQuery);

        let query: string = '';
        // @ts-ignore
        console.log('Query Result:', rows.length);
        // @ts-ignore
        if (rows.length === 0) {
            console.log('no data - insert');
            query = `insert into unique_users (cnb_id, device_id, site_id) values(1,1,1)`
        } else {
            let id = Number(rows[0]['device_id'])+1;
            console.log(`${new Date()} - update id = ${id}`)
            query= `UPDATE test.unique_users
            SET device_id=${id}, site_id=${id}, modified_at=now()
            WHERE cnb_id=1`
        }

        // 잠시 대기 (동시성 테스트를 위해)
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2초 동안 대기
        console.log(query);
        await connection.execute(query);
        // 트랜잭션 커밋
        await connection.commit();

        console.log('Transaction committed successfully.');
    } catch (error) {
        console.error('Error:', error.sqlMessage);

        // 트랜잭션 롤백
        await connection.rollback();
        console.log('Transaction rolled back.');
        throw new Error();
    } finally {
        // 연결 종료
        await connection.end();
    }
}

export async function main(idx: number) {
    Array.from({length: idx}).map(()=> concurrency());
}
