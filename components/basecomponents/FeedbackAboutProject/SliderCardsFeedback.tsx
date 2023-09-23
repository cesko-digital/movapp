import avatar from '../../../public/icons/about/default_avatar.png';
import Image from 'next/image';
import { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { Modal } from 'components/basecomponents/Modal';

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
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus pulvinar elementum integer enim. Nisl nisi scelerisque eu ultrices. Habitant morbi tristique senectus et netus et malesuada. Auctor eu augue ut lectus. Viverra tellus in hac habitasse platea dictumst vestibulum rhoncus est. Vulputate enim nulla aliquet porttitor. Felis donec et odio pellentesque diam volutpat commodo sed egestas. Egestas egestas fringilla phasellus faucibus scelerisque eleifend donec. Sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum. Erat velit scelerisque in dictum. Sit amet volutpat consequat mauris nunc congue. Nunc sed blandit libero volutpat sed cras ornare arcu dui. Sed nisi lacus sed viverra tellus in hac habitasse platea. Elementum pulvinar etiam non quam lacus suspendisse faucibus interdum posuere. Nibh ipsum consequat nisl vel pretium. Ullamcorper malesuada proin libero nunc consequat interdum varius sit amet. Lobortis feugiat vivamus at augue eget arcu dictum. Amet aliquam id diam maecenas ultricies mi eget. Porttitor massa id neque aliquam vestibulum morbi blandit cursus risus. Egestas tellus rutrum tellus pellentesque eu. Vulputate enim nulla aliquet porttitor lacus luctus accumsan tortor posuere. Sit amet justo donec enim diam vulputate ut pharetra. Et netus et malesuada fames ac turpis egestas sed. Luctus venenatis lectus magna fringilla urna porttitor rhoncus. Arcu felis bibendum ut tristique et egestas quis. Sit amet massa vitae tortor condimentum lacinia quis vel. Amet luctus venenatis lectus magna. Volutpat maecenas volutpat blandit aliquam etiam erat velit. Gravida dictum fusce ut placerat orci nulla pellentesque. Commodo viverra maecenas accumsan lacus vel. Habitasse platea dictumst quisque sagittis purus sit amet volutpat consequat. Risus quis varius quam quisque id diam vel. Blandit massa enim nec dui nunc mattis. Erat velit scelerisque in dictum non. Pellentesque habitant morbi tristique senectus et netus et. Suspendisse sed nisi lacus sed viverra. Risus ultricies tristique nulla aliquet. Pretium nibh ipsum consequat nisl vel pretium lectus quam. Lectus arcu bibendum at varius vel pharetra. Odio tempor orci dapibus ultrices in iaculis nunc sed augue. Lorem donec massa sapien faucibus et molestie. Libero justo laoreet sit amet cursus sit amet dictum sit. Ut tortor pretium viverra suspendisse potenti nullam ac. Varius duis at consectetur lorem donec massa sapien. Ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Turpis nunc eget lorem dolor. Vel turpis nunc eget lorem. Aenean pharetra magna ac placerat vestibulum lectus. Aliquam sem et tortor consequat id porta nibh venenatis. Eget arcu dictum varius duis at consectetur lorem. Mattis aliquam faucibus purus in massa tempor. Semper risus in hendrerit gravida rutrum quisque non. Massa sapien faucibus et molestie ac feugiat sed lectus vestibulum. Ut morbi tincidunt augue interdum velit euismod in pellentesque massa. In nisl nisi scelerisque eu ultrices vitae auctor eu augue. Adipiscing at in tellus integer feugiat scelerisque varius morbi enim. Lectus magna fringilla urna porttitor rhoncus dolor purus. Nibh mauris cursus mattis molestie a iaculis at erat. Lorem dolor sed viverra ipsum nunc. Velit euismod in pellentesque massa. Mi quis hendrerit dolor magna eget est lorem ipsum dolor. Leo in vitae turpis massa sed elementum. Amet venenatis urna cursus eget nunc scelerisque viverra mauris in. Feugiat scelerisque varius morbi enim nunc. Sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus. Massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin. Bibendum enim facilisis gravida neque. Turpis egestas maecenas pharetra convallis posuere morbi leo urna. Ut porttitor leo a diam sollicitudin tempor id. Auctor urna nunc id cursus metus aliquam eleifend. Ultrices gravida dictum fusce ut placerat orci. Eu ultrices vitae auctor eu. Cursus turpis massa tincidunt dui ut ornare lectus sit amet. Tincidunt eget nullam non nisi est. Arcu cursus euismod quis viverra. Dui nunc mattis enim ut tellus. Imperdiet sed euismod nisi porta lorem mollis aliquam. Fusce id velit ut tortor pretium viverra. Neque aliquam vestibulum morbi blandit. Tempor orci eu lobortis elementum nibh tellus molestie. Ac tortor dignissim convallis aenean et tortor. Duis ut diam quam nulla porttitor massa id neque aliquam. Aliquam nulla facilisi cras fermentum odio eu feugiat. Diam in arcu cursus euismod quis viverra nibh cras. Dui faucibus in ornare quam. Malesuada fames ac turpis egestas. Morbi tristique senectus et netus et malesuada. Mauris sit amet massa vitae tortor condimentum lacinia quis vel. Lacus sed viverra tellus in. Nibh mauris cursus mattis molestie a iaculis at. Eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada.',
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
      <div className="md:flex sm:block  m-auto justify-center items-center shadow-[#F0F0F0] rounded-2xl xl:gap-12">
        {displayedFeedbacks.map((feedback, index) => (
          <div key={feedback.id} className="pt-6 pb-8 mb-3 px-6 rounded-lg shadow-md xl:max-w-[480px] bg-white sm:max-w-[350px]">
            <Image src={feedback.avatar} alt="avatar" />
            <h3 className="mt-4 text-xl font-bold">{feedback.title}</h3>
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
          <div key={displayedFeedbacks[activeFeedbackIndex].id} className="pt-6 pb-8 px-6 rounded-lg shadow-md bg-white ">
            <Image src={displayedFeedbacks[activeFeedbackIndex].avatar} alt="avatar" />
            <h3 className="mt-4 text-xl font-bold">{displayedFeedbacks[activeFeedbackIndex].title}</h3>
            <p className="mb-4">{displayedFeedbacks[activeFeedbackIndex].author}</p>
            <p>{displayedFeedbacks[activeFeedbackIndex].text}</p>
          </div>
        )}
      </Modal>
      {currentSlide !== 0 && (
        <div className=" group-hover:block absolute top-[50%] translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-white text-primary-blue shadow-md shadow-[#00000033] cursor-pointer">
          <BsChevronLeft onClick={prevSlide} size={20} />
        </div>
      )}
      {currentSlide !== feedbacks.length - 3 && (
        <div className=" group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-white text-primary-blue shadow-md shadow-[#00000033] cursor-pointer">
          <BsChevronRight onClick={nextSlide} size={20} />
        </div>
      )}
    </div>
  );
};
