import Spinner from 'components/basecomponents/Spinner/Spinner';
import { Modal } from 'components/basecomponents/Modal';
import { SocialMedia } from 'components/basecomponents/SocialMedia';
import { FOOTER_NAVIGATION } from 'data/footerNavigation';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { getCountryVariant } from 'utils/locales';
import { useLanguage } from 'utils/useLanguageHook';

export const Footer = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const footerNavigationLinks = FOOTER_NAVIGATION[getCountryVariant()][currentLanguage];
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const closeModal = useCallback(() => {
    setIsFeedbackModalOpen(false);
  }, []);
  const openModal = useCallback(() => {
    setShowLoading(true);
    setIsFeedbackModalOpen(true);
  }, []);

  return (
    <footer className="bg-primary-yellow">
      <div className="max-w-4xl m-auto p-2 sm:py-5 ">
        <p className="text-primary-black text-center font-black text-xl sm:text-2xl mt-2 sm:mt-4 mb-2 sm:mb-6">#StandWithUkraine</p>
        <div className="text-center">
          <SocialMedia />
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start">
          {footerNavigationLinks?.map(({ title, link, description }, index) => {
            return (
              <Link key={index} href={link}>
                <a target={'_blank'} className="sm:w-2/6">
                  <div className="py-1">
                    <p className="text-primary-black text-center text-sm sm:text-base font-bold my-2">{title}</p>
                    <p className="text-primary-black text-center font-light text-xs sm:text-sm">{t(description)}</p>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
        {currentLanguage === 'cs' && (
          <p className="text-primary-black text-center pt-6">
            <button onClick={openModal} className="border-2 border-black p-1 hover:border-primary-red">
              {t('footer.feedback')}
            </button>
          </p>
        )}
        <p className="text-primary-black text-center text-xs pt-6">
          {t('footer.join_development')}{' '}
          <a href={'https://github.com/cesko-digital/movapp'} target={'_blank'} className="underline" rel="noreferrer">
            GitHub
          </a>{' '}
          | {t('footer.licence_intro')}{' '}
          <a
            href={'https://creativecommons.org/licenses/by-nc/4.0/'}
            target={'_blank'}
            className="underline"
            rel="noreferrer"
            title="Creative Commons - Attribution required, Non-commercial use only 4.0"
          >
            {t('footer.licence')}
          </a>
        </p>
      </div>
      <Modal closeModal={closeModal} isOpen={isFeedbackModalOpen}>
        <div className={`absolute flex justify-center items-center w-full h-96 ${showLoading ? '' : 'hidden'}`}>
          <Spinner />
        </div>
        <iframe
          className="airtable-embed"
          src={`https://airtable.com/embed/${t('footer.feedback_form_id')}`}
          frameBorder="0"
          width="100%"
          height="533"
          onLoad={() => setShowLoading(false)}
        />
      </Modal>
    </footer>
  );
};
