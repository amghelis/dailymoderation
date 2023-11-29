export const mediaRestApiURL = (mediaId: string) => {
  return `https://api.dailymotion.com/video/${mediaId}?fields=title`;
};
