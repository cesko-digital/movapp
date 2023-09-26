import avatar from '../../../public/icons/about/default_avatar.png';
import studio from '../../../public/icons/about/Studio-N.png';
import Image from 'next/image';
import { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { Modal } from 'components/basecomponents/Modal';

const feedbacks = [
  {
    id: 1,
    avatar: avatar,
    title: '“Konečně je tady něco, co skutečně pomáhá…”',
    author: 'M.Poláček',
    text: 'Váš web považuji za velký přínos k rozvoji komunikace s UKR komunitou. Konečně je tady něco, co skutečně pomáhá k snadné oboustranné komunikaci. Přes 20 let jsem klopotně hledal, jak přiblížit Ukrajincům v začátcích naši abecedu a nejobvyklejší životní situace.',
  },
  {
    id: 2,
    avatar: studio,
    title: '“Jednoduchá aplikace, která vám může dost pomoct…”',
    author: 'Vít Svoboda v podcastu Studio N',
    text: 'Tato aplikace je takovým praktickým slovníčkem různých pojmů, učitelkou ukrajinské abecedy a taky takovou zábavnou formou pro učení ukrajinštiny nebo češtiny pro děti. (...) Je to hezky poskládané, takže to dává smysl, velmi dobře se v tom pohybuje. (...) Je to celé taková hezká, jednoduchá aplikace, která vám může dost pomoct, pokud jste v situaci, kdy potřebujete se domluvit s Ukrajinkou nebo Ukrajincem, a taky pokud se třeba v reakci na tu aktuální krizi, nebo nejen na ni, chcete přiučit trošku ukrajinštiny. Každopádně je fajn ji mít v telefonu, kdyby cokoliv. Movapp, to je můj dnešní tip.',
  },
  {
    id: 3,
    avatar: avatar,
    title: '“Děkuji vám, protože společná řeč je dnes nesmírně důležitá!”',
    author: 'Salome Engibaryan',
    text: '“Děkuji vám, protože společná řeč je dnes nesmírně důležitá! Moc se mi líbí, že je váš styl pozitivní. Formát her se líbí nejen dětem!"',
  },
];

export const SliderFeedbacks = (): JSX.Element => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFeedbackIndex, setActiveFeedbackIndex] = useState<number | null>(null);

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? feedbacks.length - 1 : prevSlide - 1));
    setActiveFeedbackIndex(null);
  };

  const nextSlide = () => {
    const isLastSlide = currentSlide === feedbacks.length - 1;
    const newIndex = isLastSlide ? 0 : currentSlide + 1;
    setCurrentSlide(newIndex);
    setActiveFeedbackIndex(null);
  };

  const startIndex = currentSlide * 2;
  const endIndex = startIndex + 2;
  const displayedFeedbacks = feedbacks.slice(startIndex, endIndex);

  const openModalForFeedback = (feedbackIndex: number) => {
    setActiveFeedbackIndex(feedbackIndex);
    setIsModalOpen(true);
  };

  return (
    <div className="relative group">
      <div className="md:flex justify-center sm:block m-auto shadow-[#F0F0F0] rounded-2xl md:gap-12 gap-2">
        {displayedFeedbacks.map((feedback, index) => (
          <div
            key={feedback.id}
            className="pt-6 pb-8 mb-3 px-6 rounded-[16px] shadow-md xl:max-w-[480px] bg-white sm:max-w-[350px] hover:-translate-y-1 font-normal"
          >
            <Image src={feedback.avatar} alt="avatar" width={64} height={64} />
            <h3 className="mt-4 text-xl font-bold h-[56px]">{feedback.title}</h3>
            <p className="mb-4">{feedback.author}</p>
            <p className="line-clamp-5 ">{feedback.text}...</p>
            <button className="text-primary-blue decor underline decoration-1 flex" onClick={() => openModalForFeedback(index)}>
              Vice
            </button>
          </div>
        ))}
      </div>
      <Modal
        closeModal={() => {
          setIsModalOpen(false);
          setActiveFeedbackIndex(null);
        }}
        isOpen={isModalOpen}
      >
        {activeFeedbackIndex !== null && (
          <div key={displayedFeedbacks[activeFeedbackIndex].id} className="pt-6 pb-8 px-6 rounded-lg bg-white ">
            <Image src={displayedFeedbacks[activeFeedbackIndex].avatar} alt="avatar" width={64} height={64} />
            <h3 className="mt-4 text-xl font-bold">{displayedFeedbacks[activeFeedbackIndex].title}</h3>
            <p className="mb-4 mt-2">{displayedFeedbacks[activeFeedbackIndex].author}</p>
            <p>{displayedFeedbacks[activeFeedbackIndex].text}</p>
          </div>
        )}
      </Modal>
      {currentSlide !== 0 && (
        <div className=" group-hover:block absolute top-[50%] translate-x-0 translate-y-[-50%] left-5 text-4xl rounded-full p-2 bg-white text-primary-blue shadow-md shadow-[#00000033] cursor-pointer">
          <BsChevronLeft onClick={prevSlide} size={30} />
        </div>
      )}
      {currentSlide !== feedbacks.length - 2 && (
        <div className=" group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-4xl rounded-full p-2 bg-white text-primary-blue shadow-md shadow-[#00000033] cursor-pointer">
          <BsChevronRight onClick={nextSlide} size={30} />
        </div>
      )}
    </div>
  );
};
