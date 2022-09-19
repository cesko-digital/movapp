import { Modal } from 'components/basecomponents/Modal';
import Spinner from 'components/basecomponents/Spinner/Spinner';
import { useTranslation } from 'next-i18next';
import { FC, useCallback } from 'react';
import { useLanguage } from 'utils/useLanguageHook';

type Props = { setIsFeedbackModalOpen: (value: React.SetStateAction<boolean>) => void; isFeedbackModalOpen: boolean };
const FeedbackModalClientSide: FC<Props> = ({ setIsFeedbackModalOpen, isFeedbackModalOpen }) => {
  const closeModal = useCallback(() => {
    setIsFeedbackModalOpen(false);
  }, [setIsFeedbackModalOpen]);

  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  return (
    <Modal closeModal={closeModal} isOpen={isFeedbackModalOpen} unmount>
      <div className={`absolute flex justify-center items-center w-full h-96 -z-10`}>
        <Spinner />
      </div>
      <iframe
        className="airtable-embed"
        src={`https://airtable.com/embed/${t('footer.feedback_form_id')}?prefill_url=${encodeURIComponent(
          document.location.href
        )}&hide_url=true&prefill_language=${currentLanguage}&hide_language=true`}
        frameBorder="0"
        width="100%"
        height="533"
      />
    </Modal>
  );
};
export default FeedbackModalClientSide;
