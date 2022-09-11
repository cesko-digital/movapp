# Readme

## Čeština

Cílem [Movapp.cz](https://www.movapp.cz/) je usnadnit dorozumění mezi Čechy a Ukrajinci. _Mова_ [mova] znamená ukrajinsky _jazyk_. Movapp je aplikace pro trénink jazyků. Projekt vzniká v komunitě expertních dobrovolníků [Česko.Digital](https://cesko.digital/). Kontakt: pryvit@movapp.cz.

Zdrojový kód je pod MIT licencí. Texty, obrázky a audiosoubory jsou pod licencí [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.cs).

Chcete-li nám pomáhat na dalším rozvoji projektu, vyplňte formulář na [cesko.digital/join](https://cesko.digital/join) a přidejte se do Slacku. Najdete nás v kanálu _ua-movapp_ (komunikujeme česky, slovensky, anglicky a trochu také ukrajinsky).

## Українська

Мета [Movapp.cz](https://www.movapp.cz/) – полегшити спілкування між чехами та українцями. Movapp — це програма для мовного навчання. Проект створений у спільноті експертів-волонтерів [Česko.Digital](https://cesko.digital/). Контакти: pryvit@movapp.cz.

Вихідний код знаходиться під ліцензією MIT. Тексти, зображення та аудіофайли ліцензовані відповідно до [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.uk).

Якщо ви хочете стати членом команди волонтерів і допомогти нам розвивати проєкт, заповніть форму на [cesko.digital/join](https://cesko.digital/join) та приєднайтеся до нашого Slack. Ви можете знайти нас на каналі _ua-movapp_ (спілкуємося чеською, словацькою, англійською а також трохи українською).

## English

The goal of [Movapp.cz](https://www.movapp.cz/) is to make communication between Czechs and Ukrainians easier. _Mова_ [mohva] means _language_ in Ukrainian. Movapp is an application for language training. The project is developed by [Česko.Digital](https://cesko.digital/) - the community of volunteering experts. Contact: pryvit@movapp.cz.

Source code is available under the MIT license. Text, pictures and audiofiles are available under the [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) license.

If you want to help us, fill in the form at [cesko.digital/join](https://cesko.digital/join) and join Slack. You can find us in the _ua-movapp_ channel (we speak Czech, Slovak, English, and a little bit Ukrainian).

## Development

The web is written in [Next.js](https://nextjs.org/) and hosted on [Vercel](https://vercel.com/). To run it locally:

```bash
git clone https://github.com/cesko-digital/movapp.git
cd movapp
npm install
npm run dev
```

Run tests: 

```bash
npm test
```

If you have questions, [write to us on Slack](https://cesko-digital.slack.com/archives/C036GLKL7ME) or create an issue

### Development Guidelines 

* TypeScript everywhere (as much as posisble) Avoid the use of `any`, `as` typecasting, `ts-ignore`. 
* Tailwind everywhere (as much as possible). We are trying to keep the styling appraoch consistent so stick to Tailwind unless you have a specific reason to use something else.
* Use `eslint` and `prettier` in your IDE.
* Keep it simple. A lot of our contributors are junior/mid-level developers so we favor code-readability and easy onboarding to optimal performance and code cleverness. Dumb is readable, readable is smart.
* Don't reinvent the wheel. For more complex, standard components (modal, dropdown, etc) we use 3rd party headless libraries like [HeadlessUI](https://headlessui.com/) or [RadixUI](https://www.radix-ui.com/).

### Development Onboarding Notes

* [Intro to Next.js](https://www.youtube.com/watch?v=Sklc_fQBmcs&ab_channel=Fireship)
* [Intro to TypeScript](https://www.youtube.com/watch?v=zQnBQ4tB3ZA&ab_channel=Fireship)
* [Intro to Tailwind](https://www.youtube.com/watch?v=mr15Xzb1Ook&ab_channel=Fireship)
* **Localization**: We use `next-i18next` to switch localization between the main site language (i.e., Czech) and Ukrainian. 
   ``` 
   const { t } = useTranslation();
   ...
   <p>{t('homepage.box_child_title')}</p>
   ```
* **Language variants**: We use the `NEXT_PUBLIC_COUNTRY_VARIANT` environment variable to decide whether to build the Czech, Slovak or Polish variant of the site. See `locales.ts` for more details. When making changes, check that your code works in all language variants. The merge request pipeline automatically deploys the preview of each language variant.
* **Data management**:
  * We use [Airtable](https://airtable.com/appLciQqZNGDR3J6W?) for managing the site content (phrases, categories).
  * The data is pulled into the [movapp-data](https://github.com/cesko-digital/movapp-data) repository, enriched with sounds generated using Azure text-to-speech API and hosted on a CDN at [data.movapp.eu](data.movapp.eu)
  * This website, as well as mobile apps pull the data from the CDN.

  


## Contributions

* Transliteration tables between Czech and Ukrainian were kindly provided by: [vsistek/ua-translit-cz/](https://github.com/vsistek/ua-translit-cz/) under an MIT license.
