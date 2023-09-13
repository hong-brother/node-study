import redis from 'redis';
import redisLock from 'redis-lock';



async function performConcurrencyTest() {
    const client = redis.createClient();
    const lock = redisLock(client);
    await client.connect();
    try {
        const done = await lock('device')
        // Redis에서 사용자의 잔액을 가져옴
        const deviceId = await client.get(`device_id`);

        if (deviceId === null) {
            console.log(`device_id id null...`);
            // 사용자가 없으면 생성하고 초기 잔액을 설정
            await client.set(`device_id`, 1);
        } else {
            // 잠시 대기 (동시성 테스트를 위해)
            await new Promise((resolve) => setTimeout(resolve, 2000)); // 2초 동안 대기
            // 사용자가 있으면 잔액을 업데이트
            const newDeviceId = parseInt(deviceId) + 1;
            await client.set(`device_id`, newDeviceId);
            console.log(`${new Date()} - new DeviceId = ${newDeviceId}`);
        }
        await done()
    } catch (error) {
        console.error("Error:", error);
    }
}


export async function redisMain(idx: number) {
     Array.from({length: idx}).map(()=> performConcurrencyTest());
}
