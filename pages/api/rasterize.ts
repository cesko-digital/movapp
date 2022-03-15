import { NextApiRequest, NextApiResponse } from 'next';
import { join, resolve } from 'path';
import sharp from 'sharp';

const maxWidth = 5000;

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  /** Name of file under `public` to read data from */
  const fileName = (request.query.path as string) || 'icon.svg';

  /** Desired bitmap width */
  const widthString = (request.query.width as string) || '512';
  const width = parseInt(widthString);
  if (isNaN(width) || width <= 0 || width > maxWidth) {
    response.status(400).send('Invalid width');
    return;
  }

  /** Root folder to take source images from */
  const root = resolve(process.cwd(), 'public');
  const path = join(root, fileName);

  try {
    const buffer = await sharp(path).resize(width).png().toBuffer();
    const secondsPerDay = 24 * 60 * 60;
    response.setHeader('Cache-Control', `max-age=${secondsPerDay}, s-maxage=${secondsPerDay}`);
    response.setHeader('Content-type', 'image/png');
    response.status(200).send(buffer);
  } catch (e) {
    response.setHeader('Content-type', 'text/plain');
    response.status(500).send(`Image conversion failed: ${e}`);
  }
}
