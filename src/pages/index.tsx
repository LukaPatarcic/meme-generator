import { useEffect, useRef, useState } from 'react';

import type { NextPage } from 'next';

// import Image from 'next/image';

const Home: NextPage = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!context || !canvas) return;

        const image = new Image();

        image.onload = () => {
            context.drawImage(image, 0, 0);
        };
        image.setAttribute('crossorigin', 'anonymous');
        image.src = 'https://i.imgflip.com/1bij.jpg';
        setImage(image);
    }, []);

    const onChange = (text: string) => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!context || !canvas || !image) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
        const xPos = canvas.width / 2;
        const yPos = canvas.height - 10;
        context.font = '20pt Calibri';
        context.textAlign = 'center';
        context.fillStyle = 'white';
        context.fillText(text, xPos, yPos);
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
        <div className="flex items-center">
            <canvas ref={canvasRef} width={567} height={335}></canvas>
            <div className="grow ml-5">
                {Array(1)
                    .fill(0)
                    .map((_, index) => (
                        <input
                            key={index}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="Enter some text here"
                            className="w-150 bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                            id="inline-full-name"
                            type="text"
                        />
                    ))}
                <button
                    onClick={onDownload}
                    className="ml-2 flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
                >
                    Download
                </button>
            </div>
        </div>
    );
};

export default Home;
