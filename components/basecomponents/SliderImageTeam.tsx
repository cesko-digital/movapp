import { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

export const SliderImageTeam = (): JSX.Element => {
  const { t } = useTranslation();
  const slides = [
    {
      url: 'https://data.movapp.eu/images/team/large-team-summer-23.jpg',
    },
    {
      url: 'https://data.movapp.eu/images/team/large-team-photo-autumn.jpg',
    },
    {
      url: 'https://data.movapp.eu/images/team/large-team-photo.jpg',
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  const getDotClassName = (slideIndex: number) => {
    return slideIndex === currentIndex ? 'text-2xl cursor-pointer text-primary-blue' : 'text-2xl cursor-pointer text-primary-light-blue';
  };

  return (
    <div className="max-w-[650px] m-auto relative group sm:mb-40 ">
      <a href={slides[currentIndex].url} target="_blank" rel="noopener noreferrer">
        <div className="hover:shadow-lg hover:-translate-y-1 hover:scale-110 duration-300 cursor-zoom-in">
          <Image src={slides[currentIndex].url} width={640} height={400} alt={t('about_page.our_team_current_title')} />
        </div>
      </a>
      {currentIndex !== 0 && (
        <div className="group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-white text-primary-blue shadow-[#00000033] cursor-pointer">
          <BsChevronLeft onClick={prevSlide} size={20} />
        </div>
      )}
      {currentIndex !== slides.length - 1 && (
        <div className="group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-white text-primary-blue shadow-[#00000033] cursor-pointer">
          <BsChevronRight onClick={nextSlide} size={20} />
        </div>
      )}
      <div className="flex mt-8 justify-center py-2 ">
        {slides.map((slide, slideIndex) => (
          <div key={slideIndex} onClick={() => goToSlide(slideIndex)} className={getDotClassName(slideIndex)}>
            <RxDotFilled />
          </div>
        ))}
      </div>
    </div>
  );
};
