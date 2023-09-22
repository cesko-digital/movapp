import avatar from '../../../public/icons/about/default_avatar.png';
import Image from 'next/image';
import { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const feedbacks = [
  {
    id: 1,
    avatar: avatar,
    title: '“Konečně je tady něco, co skutečně pomáhá”',
    author: 'M.Poláček',
    text: 'Váš web považuji za velký přínos k rozvoji komunikace s UKR komunitou.Konečně je tady něco, co skutečně pomáhá k snadné oboustranné komunikaci.Přes 20 let jsem klopotně hledal, jak přiblížit Ukrajincům v začátcích naši abecedu a nejobvyklejší životní situace. Váš web považuji za velký přínos k rozvoji komunikace s UKR komunitou.Konečně je tady něco, co skutečně pomáhá k snadné oboustranné komunikaci.Přes 20 let jsem klopotně hledal, jak přiblížit Ukrajincům v začátcích naši abecedu a nejobvyklejší životní situace.',
  },
  {
    id: 2,
    avatar: avatar,
    title: '“Konečně je tady něco, co skutečně pomáhá”',
    author: 'M.Medina',
    text: 'Váš web považuji za velký přínos k rozvoji komunikace s UKR komunitou.Konečně je tady něco, co skutečně pomáhá k snadné oboustranné komunikaci.Přes 20 let jsem klopotně hledal, jak přiblížit Ukrajincům v začátcích naši abecedu a nejobvyklejší životní situace.',
  },
  {
    id: 3,
    avatar: avatar,
    title: '“Konečně je tady něco, co skutečně pomáhá”',
    author: 'M.Dunan',
    text: 'Váš web považuji za velký přínos k rozvoji komunikace s UKR komunitou.Konečně je tady něco, co skutečně pomáhá k snadné oboustranné komunikaci.Přes 20 let jsem klopotně hledal, jak přiblížit Ukrajincům v začátcích naši abecedu a nejobvyklejší životní situace.',
  },
  {
    id: 4,
    avatar: avatar,
    title: '“Konečně je tady něco, co skutečně pomáhá”',
    author: 'M.Koshir',
    text: 'Váš web považuji za velký přínos k rozvoji komunikace s UKR komunitou.Konečně je tady něco, co skutečně pomáhá k snadné oboustranné komunikaci.Přes 20 let jsem klopotně hledal, jak přiblížit Ukrajincům v začátcích naši abecedu a nejobvyklejší životní situace.',
  },
  {
    id: 5,
    avatar: avatar,
    title: '“Konečně je tady něco, co skutečně pomáhá”',
    author: 'M.Stredny',
    text: 'Váš web považuji za velký přínos k rozvoji komunikace s UKR komunitou.Konečně je tady něco, co skutečně pomáhá k snadné oboustranné komunikaci.Přes 20 let jsem klopotně hledal, jak přiblížit Ukrajincům v začátcích naši abecedu a nejobvyklejší životní situace.',
  },
];

export const SliderCardsFeedbacks = (): JSX.Element => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? feedbacks.length - 1 : prevSlide - 1));
  };

  const nextSlide = () => {
    const isLastSlide = currentSlide === feedbacks.length - 1;
    const newIndex = isLastSlide ? 0 : currentSlide + 1;
    setCurrentSlide(newIndex);
  };

  const startIndex = currentSlide * 2;
  const endIndex = startIndex + 2;
  const displayedFeedbacks = feedbacks.slice(startIndex, endIndex);

  return (
    <div className="relative group">
      <div className="flex m-auto justify-center items-center shadow-[#F0F0F0] rounded-2xl gap-12">
        {displayedFeedbacks.map((feedbacks) => (
          <div key={feedbacks.id} className="pt-6 pb-8 px-6 rounded-lg shadow-md max-w-[480px] bg-white ">
            <Image src={feedbacks.avatar} alt="avatar" />
            <h3 className="mt-4 text-xl font-bold">{feedbacks.title}</h3>
            <p className="mb-4">{feedbacks.author}</p>
            <p className="line-clamp-5 ">{feedbacks.text}</p>
            <button className="text-primary-blue decor underline decoration-1 flex ml-[300px]">Vice</button>
          </div>
        ))}
      </div>
      {/* Left arrow */}
      {currentSlide !== 0 && (
        <div className=" group-hover:block absolute top-[50%] translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-white text-primary-blue shadow-md shadow-[#00000033] cursor-pointer">
          <BsChevronLeft onClick={prevSlide} size={20} />
        </div>
      )}
      {/* Right arrow */}
      {currentSlide !== feedbacks.length - 3 && (
        <div className=" group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-white text-primary-blue shadow-md shadow-[#00000033] cursor-pointer">
          <BsChevronRight onClick={nextSlide} size={20} />
        </div>
      )}
    </div>
  );
};
