import Link from 'next/link';
import { useRouter } from 'next/router';

interface NestedLayoutProps {
  children: React.ReactNode;
}

const secondaryNavigation: { name: string; link: string }[] = [
  { name: 'O nás', link: '/about' },
  { name: 'O projektu', link: '/about/project' },
  { name: 'Náš tým', link: '/about/team' },
];

export const NestedLayout = ({ children }: NestedLayoutProps) => {
  const { route } = useRouter();

  const getActiveRoute = () => secondaryNavigation.find(({ link }) => link.includes(route));

  return (
    <section className="max-w-7xl pb-6 mx-auto w-full">
      <nav className="mb-6">
        <ul className="flex flex-row flex-1 bg-primary-yellow">
          {secondaryNavigation.map(({ name, link }) => (
            <Link key={name} href={link} passHref>
              <li
                className={`mr-6 last:pr-0 first:pl-1 py-2 cursor-pointer ${
                  getActiveRoute()?.link === link && 'text-primary-blue underline underline-offset-8 decoration-white'
                }`}
              >
                {name}
              </li>
            </Link>
          ))}
        </ul>
      </nav>
      {children}
    </section>
  );
};
