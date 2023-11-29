import Button from '../button/Button';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { actions } from '../../redux/mediaSlice';

type ModerationControlProps = {
  censor: () => void;
  validate: () => void;
  skip: () => void;
};

const ModerationControls: React.FC<ModerationControlProps> = ({
  censor,
  validate,
  skip,
}) => {
  const mediaState = useAppSelector((state) => state.media);
  const mediaDispacth = useAppDispatch();

  const loading = mediaState.moderationStatus != 'idle';
  const disableControls = mediaState.moderationReason.length == 0 || loading;

  return (
    <div className="flex flex-col justify-between flex-grow w-2/12">
      <div>
        <input
          value={mediaState.moderationReason}
          onChange={(e) =>
            mediaDispacth(actions.setModerationReason(e.target.value.trim()))
          }
          type="text"
          className="rounded-md border-2 p-3 border-gray-400 w-full mb-4"
          placeholder="Reason..."
          data-testid="reason-input"
        />

        <div
          className="grid grid-cols-2 gap-2 mb-2"
          data-testid="buttons-container"
        >
          <Button
            disabled={disableControls}
            loading={mediaState.moderationStatus == 'censoring'}
            type="censor"
            onClick={() => censor()}
          >
            Censor
          </Button>
          <Button
            disabled={disableControls}
            loading={mediaState.moderationStatus == 'validating'}
            type="valid"
            onClick={() => validate()}
          >
            Valid
          </Button>
        </div>
        <Button
          disabled={loading}
          loading={mediaState.moderationStatus == 'skipping'}
          type="skip"
          onClick={() => skip()}
        >
          Skip
        </Button>
      </div>
    </div>
  );
};

export default ModerationControls;
