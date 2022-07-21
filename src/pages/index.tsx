import { useEffect, useRef, useState } from 'react';

import type { NextPage } from 'next';

import NextImage from 'next/image';

import { Memes } from '@prisma/client';
import { createSSGHelpers } from '@trpc/react/ssg';
import { SketchPicker } from 'react-color';
import superjson from 'superjson';

import { createContext } from '@server/router/context';
import { appRouter } from '@server/router/index';
import { trpc } from 'utils/trpc';

const Home: NextPage = () => {
    const { data: memes } = trpc.useQuery(['getMemeImages']);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [texts, setTexts] = useState<string[]>([]);
    const [meme, setMeme] = useState<Memes | null>(null);
    const [color, setColor] = useState<string>('#fff');
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!context || !canvas || !memes) return;
        const randomMeme = memes[Math.floor(Math.random() * memes.length)]!;
        setTexts(Array(randomMeme.box_count).fill(''));
        drawImage(randomMeme);
        setMeme(randomMeme);
        setImage(image);
    }, []);

    const drawImage = (meme: Memes) => {
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;
        const image = new Image();

        image.onload = () => {
            const hRatio = canvas.width / meme.width;
            const vRatio = canvas.height / meme.height;
            const ratio = Math.min(hRatio, vRatio);
            const centerShift_x = (canvas.width - meme.width * ratio) / 2;
            const centerShift_y = (canvas.height - meme.height * ratio) / 2;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(
                image,
                0,
                0,
                meme.width,
                meme.height,
                centerShift_x,
                centerShift_y,
                meme.width * ratio,
                meme.height * ratio
            );
        };
        image.setAttribute('crossorigin', 'anonymous');
        image.src = meme.picture_url;
        console.dir(image);
        setImage(image);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        console.log(!!image);
        if (!context || !canvas || !meme || !image) return;

        const hRatio = canvas.width / meme.width;
        const vRatio = canvas.height / meme.height;
        const ratio = Math.min(hRatio, vRatio);
        const centerShift_x = (canvas.width - meme.width * ratio) / 2;
        const centerShift_y = (canvas.height - meme.height * ratio) / 2;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(
            image,
            0,
            0,
            meme.width,
            meme.height,
            centerShift_x,
            centerShift_y,
            meme.width * ratio,
            meme.height * ratio
        );
        texts.map((text, index) => {
            const xPos = canvas.width / 2;
            const yPos = (index + 1) * 100;
            console.log(yPos);
            context.font = '20pt Calibri';
            context.textAlign = 'center';
            context.fillStyle = color;
            context.fillText(text, xPos, yPos, 200);
        });
    }, [texts, color]);

    const onImageSelect = (meme: Memes) => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!context || !canvas) return;

        drawImage(meme);
        setMeme(meme);
        setTexts(Array(meme.box_count).fill(''));
    };

    const onChange = (index: number, text: string) => {
        setTexts((texts) => {
            const newTexts = [...texts];
            newTexts.splice(index, 1, text);
            return newTexts;
        });
    };

    const onColorChange = (color: string) => {
        setColor(color);
    };

    const onDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <>
            <div className="flex items-center">
                <div style={{ width: 600 }}>
                    <canvas width={600} height={600} ref={canvasRef} />
                </div>
                <div className="grow ml-5">
                    {texts.map((_, index) => (
                        <input
                            key={index}
                            onChange={(e) => onChange(index, e.target.value)}
                            value={texts[index]}
                            placeholder="Enter some text here"
                            className="w-150 bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                            id="inline-full-name"
                            type="text"
                        />
                    ))}
                    <SketchPicker
                        color={color}
                        onChange={(color) => onColorChange(color.hex)}
                    />
                    <button
                        onClick={onDownload}
                        className="ml-2 flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
                    >
                        Download
                    </button>
                </div>
            </div>
            <div
                className="overflow-scroll overflow-y-hidden"
                style={{ width: 600, height: 100, whiteSpace: 'nowrap' }}
            >
                {memes?.map((meme, index) => (
                    <div key={index} className="mr-2 inline-block">
                        <NextImage
                            onClick={() => onImageSelect(meme)}
                            src={meme.picture_url}
                            width={100}
                            height={100}
                        />
                    </div>
                ))}
            </div>
        </>
    );
};

export async function getStaticProps() {
    const ssg = await createSSGHelpers({
        router: appRouter,
        ctx: await createContext(),
        transformer: superjson,
    });

    await ssg.fetchQuery('getMemeImages');

    return {
        props: {
            trpcState: ssg.dehydrate(),
        },
        revalidate: 100,
    };
}

export default Home;
