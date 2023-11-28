import Thumbnail from './Thumbnail';

type MediaMetaDataContainerProps = {
  thumbnailURL: string;
  category: string;
  channelName: string;
};

const MediaMetaDataContainer: React.FC<MediaMetaDataContainerProps> = ({
  thumbnailURL,
  category,
  channelName,
}) => {
  return (
    <div className="flex flex-col gap-2 w-2/12">
      <Thumbnail thumbnailURL={thumbnailURL} />
      <div>
        <h2 className="font-bold text-xl">Channel name</h2>
        <h2>{channelName}</h2>
      </div>

      <div>
        <h2 className="font-bold text-xl">Media category</h2>
        <h2>{category}</h2>
      </div>
    </div>
  );
};

export default MediaMetaDataContainer;
