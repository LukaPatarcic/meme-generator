import { createRouter } from './context';

export const urlShortenRouter = createRouter().mutation('example', {
    async resolve() {
        return 'Hello World';
    },
});
