import fetch from 'node-fetch';

import { prisma } from '../server/db/client';

async function fetchData() {
    console.log('Hello from node');
    const res = await fetch('https://api.imgflip.com/get_memes');
    const data = await res.json();
    await prisma.memes.deleteMany({
        where: {
            id: {
                gt: 0,
            },
        },
    });
    data.data.memes.map(
        async ({ box_count, name, url, width, height }: any) => {
            await prisma.memes.create({
                data: {
                    box_count,
                    height,
                    width,
                    name,
                    picture_url: url,
                },
            });
        }
    );
}
fetchData();
