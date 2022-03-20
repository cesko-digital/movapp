import ChevronUp from 'public/icons/chevron-up.svg';

export const ScrollToTop = () => {
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button onClick={handleScrollTop} className="fixed  bg-white bottom-6 right-6 cursor-pointer shadow-around p-2 rounded-md">
      <ChevronUp />
    </button>
  );
};
