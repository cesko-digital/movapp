'use client';
import avatar from '../../../public/icons/about/default_avatar.png';
import studio from '../../../public/icons/about/Studio-N.png';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { Modal } from 'components/basecomponents/Modal';

import { useTranslation } from 'react-i18next';

type Feedback = {
  id: number;
  avatar: string;
  author: string;
  title: string;
  text: string;
};
// type I18nType = (key: string) => string;

export const SliderFeedbacksSm = (): JSX.Element => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFeedbackIndex, setActiveFeedbackIndex] = useState<number | null>(null);

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const feedback = [
      {
        id: 1,
        avatar: avatar,
        author: 'M.Poláček',
        title: t('feedbacks-section.id-1_title'),
        text: t('feedbacks-section.id-1_text'),
      },
      {
        id: 2,
        avatar: studio,
        author: 'Vít Svoboda v podcastu Studio N',
        title: t('feedbacks-section.id-2_title'),
        text: t('feedbacks-section.id-2_text'),
      },
      {
        id: 3,
        avatar: avatar,
        author: 'Salome Engibaryan',
        title: t('feedbacks-section.id-3_title'),
        text: t('feedbacks-section.id-3_text'),
      },
    ];

    setFeedbacks(feedback);
    setLoading(false);
  }, [t]);

  const prevSlide = () => {
    const isFirstSlide = currentSlide === 0;
    const newIndex = isFirstSlide ? feedbacks.length - 1 : currentSlide - 1;
    setCurrentSlide(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentSlide === feedbacks.length - 1;
    const newIndex = isLastSlide ? 0 : currentSlide + 1;
    setCurrentSlide(newIndex);
    setActiveFeedbackIndex(null);
  };

  const openModalForFeedback = (feedbackIndex: number) => {
    setActiveFeedbackIndex(feedbackIndex);
    setIsModalOpen(true);
  };

  // const a  = [
  //   {
  //     id: 1,
  //     avatar: avatar,
  //     author: 'M.Poláček',
  //     title: t('feedbacks-section.id-1_title'),
  //     text: t('feedbacks-section.id-1_text'),
  //   },
  //   {
  //     id: 2,
  //     avatar: studio,
  //     author: 'Vít Svoboda v podcastu Studio N',
  //     title: t('feedbacks-section.id-2_title'),
  //     text: t('feedbacks-section.id-2_text'),
  //   },
  //   {
  //     id: 3,
  //     avatar: avatar,
  //     author: 'Salome Engibaryan',
  //     title: t('feedbacks-section.id-3_title'),
  //     text: t('feedbacks-section.id-3_text'),
  //   },]
  // console.log(feedbacks);
  return (
    <div className="relative group">
      <div className=" max-w-[350px] m-auto shadow-[#F0F0F0] rounded-2xl">
        {loading ? (
          <p>Загрузка данных...</p>
        ) : (
          <div
            key={feedbacks[currentSlide].id}
            className="mb-3 px-6 pt-6 pb-8 rounded-[16px] shadow-md bg-white max-w-[350px] hover:-translate-y-1 font-normal"
          >
            <Image src={feedbacks[currentSlide].avatar} alt="avatar" width={64} height={64} />
            <h3 className="mt-4 text-base font-bold h-[56px]">{feedbacks[currentSlide].title}</h3>
            <p className="mb-4 mt-4 text-sm">{feedbacks[currentSlide].author}</p>
            <p className="line-clamp-5 text-sm">{feedbacks[currentSlide].text}...</p>
            <button className="text-primary-blue decor underline decoration-1 flex" onClick={() => openModalForFeedback(currentSlide)}>
              Vice
            </button>
          </div>
        )}
      </div>
      <Modal
        closeModal={() => {
          setIsModalOpen(false);
          setActiveFeedbackIndex(null);
        }}
        isOpen={isModalOpen}
      >
        {activeFeedbackIndex !== null && (
          <div key={feedbacks[activeFeedbackIndex].id} className="pt-6 pb-8 px-6 rounded-lg bg-white ">
            <Image src={feedbacks[activeFeedbackIndex].avatar} alt="avatar" width={64} height={64} />
            <h3 className="mt-4 text-xl font-bold">{feedbacks[activeFeedbackIndex].title}</h3>
            <p className="mb-4 mt-2">{feedbacks[activeFeedbackIndex].author}</p>
            <p>{feedbacks[activeFeedbackIndex].text}</p>
          </div>
        )}
      </Modal>
      {currentSlide !== 0 && (
        <div className=" group-hover:block absolute top-[100%] translate-x-0 translate-y-[-50%] left-5 text-4xl rounded-full p-2 bg-white text-primary-blue shadow-md shadow-[#00000033] cursor-pointer">
          <BsChevronLeft onClick={prevSlide} size={20} />
        </div>
      )}
      {currentSlide !== feedbacks.length - 1 && (
        <div className=" group-hover:block absolute top-[100%] -translate-x-0 translate-y-[-50%] right-5 text-4xl rounded-full p-2 bg-white text-primary-blue shadow-md shadow-[#00000033] cursor-pointer">
          <BsChevronRight onClick={nextSlide} size={20} />
        </div>
      )}
    </div>
  );
};
