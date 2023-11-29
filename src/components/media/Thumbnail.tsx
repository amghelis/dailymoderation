import { useState } from 'react';
import ArrowSpinner from '../animation/ArrowSpinner';

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
        draggable={false}
        onLoad={() => setIsloading(false)}
        className="w-full aspect-video object-cover rounded-lg max-w-md"
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </>
  );
};

export default Thumbnail;
