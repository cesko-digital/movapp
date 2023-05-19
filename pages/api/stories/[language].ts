import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { language },
  } = req;

  // Adjust the path based on your file structure
  const filePath = path.join(process.cwd(), `data/translations/${language}/pohadka_mesicky.json`);

  // Read the file synchronously (consider async reading for larger files)
  const jsonData = fs.readFileSync(filePath, 'utf8');

  // Parse the JSON string into a JavaScript object
  const data = JSON.parse(jsonData);

  // Send the data back to the client
  res.status(200).json(data);
}
