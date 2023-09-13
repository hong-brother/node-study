import {concurrency, main} from "../src/mysql-test";

it("동시성 테스트", () => {
    const concurrencyLevel = 5
    expect(()=> main(5)).toThrowError(new Error());
});

