import Redis from 'ioredis';
import Redlock from 'redlock';

const redis = new Redis();
const redlock = new Redlock([redis],  {
    driftFactor: 0.01, // clock drift를 보상하기 위해 driftTime 지정에 사용되는 요소, 해당 값과 아래 ttl값을 곱하여 사용.
    retryCount: 10, // 에러 전까지 재시도 최대 횟수
    retryDelay: 200, // 각 시도간의 간격
    retryJitter: 200, // 재시도시 더해지는 되는 쵀대 시간(ms)
    automaticExtensionThreshold: 500, // lock 연장 전에 남아야 하는 최소 시간(ms)
});


async function performConcurrencyTest() {
    let lock = await redlock.lock(["a"], 5000);
    try {
        const deviceId = await redis.get(`device_id`);

        if (deviceId === null) {
            console.log(`device_id id null...`);
            // 사용자가 없으면 생성하고 초기 잔액을 설정
            await redis.set(`device_id`, 1);
        } else {
            // 잠시 대기 (동시성 테스트를 위해)
            await new Promise((resolve) => setTimeout(resolve, 2000)); // 2초 동안 대기
            // 사용자가 있으면 잔액을 업데이트
            const newDeviceId = parseInt(deviceId) + 1;
            await redis.set(`device_id`, newDeviceId);
            console.log(`${new Date()} - new DeviceId = ${newDeviceId}`);
        }
        await lock.unlock();
    } catch (error) {
        console.error("Error:", error);
    }
    console.log('release the lock');
}


export async function redisMain(idx: number) {
     Array.from({length: idx}).map(()=> performConcurrencyTest());
}
