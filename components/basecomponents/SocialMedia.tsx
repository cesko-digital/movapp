import Image from 'next/image';

type Props = {
  className?: string;
};

export const SocialMedia = ({ className }: Props): JSX.Element => (
  <>
    {socialMedia.map(({ name, link, img }) => (
      <a key={name} href={link} target="_blank" rel="noreferrer" className={`ml-2 first:ml-0 ${className}`}>
        <Image src={img} width="34px" height="34px" alt={name} />
      </a>
    ))}
  </>
);

const socialMedia: { name: string; link: string; img: string }[] = [
  {
    name: 'Facebook',
    link: 'https://www.facebook.com/movappcz',
    img: '/icons/socials/facebook.svg',
  },
  {
    name: 'Instagram',
    link: 'https://www.instagram.com/movappcz/',
    img: '/icons/socials/instagram.svg',
  },
  {
    name: 'Twitter',
    link: 'https://twitter.com/movappcz',
    img: '/icons/socials/twitter.svg',
  },
  {
    name: 'LinkedIn',
    link: 'https://www.linkedin.com/company/movapp-cz/',
    img: '/icons/socials/linkedin.svg',
  },
  {
    name: 'Telegram',
    link: 'https://t.me/movappcz',
    img: '/icons/socials/telegram.svg',
  },
];
