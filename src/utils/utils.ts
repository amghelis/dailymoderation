/**
 * Accepts a string argument supposed to be a media id and return a formatted
 * API URL that can then be called if needed (using fetch, aciox, etc.)
 * @param {string} mediaId - the media id
 * @returns {string} Formatted API URL
 */
export const mediaRestApiURL = (mediaId: string) => {
  return `https://api.dailymotion.com/video/${mediaId}?fields=title`;
};
