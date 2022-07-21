import { prisma } from '../db/client';
import { createRouter } from './context';

export const urlShortenRouter = createRouter().query('getMemeImages', {
    async resolve() {
        const images = await prisma.memes.findMany();
        return images;
    },
});
