import config from "../../config";

export function renderFilename(input) {
  if(input) {
    return `${config.DOMAIN_URL}/images/file/${input}`;
  }
}
