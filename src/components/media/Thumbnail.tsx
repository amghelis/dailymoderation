import { useState } from 'react';
import ArrowSpinner from '../loader/ArrowSpinner';

type ThumbnailProps = {
  thumbnailURL: string;
};

const Thumbnail: React.FC<ThumbnailProps> = ({ thumbnailURL }) => {
  const [isLoading, setIsloading] = useState(true);

  return (
    <>
      {isLoading && <ArrowSpinner />}
      <img
        src={thumbnailURL}
        onLoad={() => setIsloading(false)}
        className="w-full aspect-video object-cover rounded-lg max-w-md"
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </>
  );
};

export default Thumbnail;
