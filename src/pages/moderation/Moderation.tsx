import ModerationControls from '../../components/controls/ModerationControls';
import MediaContainer from '../../components/media/MediaContainer';
import MediaMetaDataContainer from '../../components/media/MediaMetaDataContainer';
import useMediaModeration from '../../hooks/useMediaModeration';

const ModerationPage = () => {
  const { media, skip, validate, censor } = useMediaModeration();

  return (
    <div className="flex gap-4 p-6">
      <MediaMetaDataContainer
        category={media.category}
        channelName={media.channel.name}
        thumbnailURL={media.thumbnailURL}
      />

      <MediaContainer
        title={media.title}
        description={media.description}
        embedURL={media.embedURL}
      />

      <ModerationControls censor={censor} validate={validate} skip={skip} />
    </div>
  );
};

export default ModerationPage;
