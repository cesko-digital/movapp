export const handleDownloadPdfs = (plausible: any, language: string, url: string, category: string): void => {
  console.log(`${category} - Download PDF`);
  plausible('Download', { props: { language, url, category } });
};
