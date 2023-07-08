import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useLanguage } from 'utils/useLanguageHook';
import { Modal } from './Modal';
import Spinner from './Spinner/Spinner';

const Feedback = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  if (currentLanguage === 'pl') {
    return null;
  }

  const url = encodeURIComponent(document.location.href);
  const iframeSrc = `https://airtable.com/embed/${t(
    'footer.feedback_form_id'
  )}?prefill_url=${url}&hide_url=true&prefill_language=${currentLanguage}&hide_language=true`;

  return (
    <>
      <div className="text-center">
        <button onClick={() => setModalOpen(true)} className="border-2 border-black p-1 hover:border-primary-red mt-6">
          {t('footer.feedback')}
        </button>
      </div>
      <Modal closeModal={() => setModalOpen(false)} isOpen={modalOpen} unmount>
        <div className="absolute flex justify-center items-center w-full h-full -z-50 top-0 left-0">
          {/* style is on the spinner for iOS safari compatibility */}
          <Spinner style={{ zIndex: -50 }} />
        </div>
        <iframe className="airtable-embed" src={iframeSrc} frameBorder="0" width="100%" height="533" />
      </Modal>
    </>
  );
};

export default Feedback;
