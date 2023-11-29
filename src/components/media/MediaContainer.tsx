type MediaContainerProps = {
  title: string;
  description?: string;
  embedURL: string;
};

/**
 * MediaContainer Component
 *
 * Renders a video media element with a title and an optional description.
 *
 * Props:
 *   - title (string): The title of the media.
 *   - description (string, optional): A description or additional information about the media.
 *   - embedURL (string): The URL of the media to be embedded.
 *
 * @param {MediaContainerProps} { title, description, embedURL } - Destructured props object.
 * @returns {React.ReactElement} A React Element representing the media container.
 */
const MediaContainer: React.FC<MediaContainerProps> = ({
  title,
  description,
  embedURL,
}) => {
  return (
    <div className="w-8/12 flex flex-col gap-2">
      <iframe
        className="rounded-lg bg-black"
        src={`${embedURL}?autoplay=1`}
        width={'auto'}
        height={'600'}
        allowFullScreen
      ></iframe>
      <h1 className="text-4xl font-medium">{title}</h1>
      {description && <p className="max-w-4xl">{description}</p>}
      {!description && (
        <p className="max-w-4xl italic text-gray-700">
          This media has no description
        </p>
      )}
    </div>
  );
};

export default MediaContainer;
