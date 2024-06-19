import { renderFilename } from './renderFilename';

export async function attendDescription(
  imageAttach: any,
  fileAttach: any,
  string: string,
) {
  const regex = /<img src="[^"]*">/g;
  const regaxFile = /<a([^>]*?)href="[^"]*"([^>]*?)>/g;
  let index = 0;
  let C = string.replace(regex, function (match) {
    let imgLink = renderFilename(imageAttach[index].filename);
    index++;
    return '<img src="' + imgLink + '">';
  });
  let index2 = 0;
  let des = C.replace(regaxFile, function (matchF) {
    let fileLink = renderFilename(fileAttach[index2]?.filename);
    index2++;
    return `<a href="${fileLink}" target="_blank" style="background: #091e4214; padding: 5px; border-radius: 5px; font-weight: bold;" rel="noopener">`;
  });

  return des;
}
