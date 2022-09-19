import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { useLanguage } from 'utils/useLanguageHook';

const FeedbackModal = dynamic(() => import('./FeedbackModalClientSide'), {
  ssr: false,
});
const Feedback = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsFeedbackModalOpen(true);
  }, []);

  return currentLanguage === 'cs' ? (
    <p className="text-primary-black text-center pt-6">
      <button onClick={openModal} className="border-2 border-black p-1 hover:border-primary-red">
        {t('footer.feedback')}
      </button>
      <FeedbackModal isFeedbackModalOpen={isFeedbackModalOpen} setIsFeedbackModalOpen={setIsFeedbackModalOpen} />
    </p>
  ) : null;
};

export default Feedback;
