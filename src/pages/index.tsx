import type { NextPage } from 'next';

import Image from 'next/image';

const Home: NextPage = () => {
    return (
        <div>
            <Image
                src="https://i.imgflip.com/1bij.jpg"
                alt="meme"
                width={568}
                height={335}
            />
            {Array(3)
                .fill(0)
                .map((_, index) => (
                    <input key={index} className="border border-black" />
                ))}
            Meme Generator
        </div>
    );
};

export default Home;
