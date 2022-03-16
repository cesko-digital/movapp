import { NextApiRequest, NextApiResponse } from 'next';

const getGoogleTranslateUrl = (language: string, text: string) =>
  `https://translate.google.com/translate_tts?tl=${language}&q=${encodeURIComponent(text)}&client=tw-ob`;

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const lang = (request.query.lang as string) || 'cs';
  const text = (request.query.text as string) || 'Jupí, funguje to!';
  const googleResponse = await fetch(getGoogleTranslateUrl(lang, text));
  if (googleResponse.ok) {
    const secondsPerDay = 24 * 60 * 60;
    response.setHeader('Cache-Control', `max-age=${secondsPerDay}, s-maxage=${secondsPerDay}`);
    response.setHeader('Content-type', 'audio/mpeg');
    response.status(200).send(googleResponse.body);
  } else {
    response.setHeader('Content-type', 'text/plain');
    response.status(500).send(`Sorry, Google Translate returned HTTP ${googleResponse.status} / ${googleResponse.statusText}`);
  }
}
