import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useLanguage } from 'utils/useLanguageHook';
import { Modal } from 'components/basecomponents/Modal';
import Spinner from 'components/basecomponents/Spinner/Spinner';
import { Button } from 'components/basecomponents/Button';

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
      <div className="text-center mt-10">
        <p className="text-sm">{t('exercise_page.feedback')}</p>
        <Button buttonStyle="primaryLight" onClick={() => setModalOpen(true)} className="mt-6">
          {t('exercise_page.write_us')}
        </Button>
      </div>
      <Modal closeModal={() => setModalOpen(false)} isOpen={modalOpen} unmount>
        <div className={`absolute flex justify-center items-center w-full h-full -z-10 top-0 left-0`}>
          <Spinner />
        </div>
        <iframe className="airtable-embed" src={iframeSrc} frameBorder="0" width="100%" height="533" />
      </Modal>
    </>
  );
};

export default Feedback;
