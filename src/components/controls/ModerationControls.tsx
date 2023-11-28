import Button from '../button/Button';
import type { ModerationStatus } from '../../globals';

type ModerationControlProps = {
  censor: () => void;
  validate: () => void;
  skip: () => void;
  reason: string;
  setReason: (reason: string) => void;
  status: ModerationStatus;
};

const ModerationControls: React.FC<ModerationControlProps> = ({
  censor,
  validate,
  skip,
  reason,
  setReason,
  status,
}) => {
  const loading = status != 'idle';
  const disableControls = reason.length == 0 || loading;

  return (
    <div className="flex flex-col justify-between flex-grow w-2/12">
      <div>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
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
            loading={status == 'censoring'}
            type="censor"
            onClick={() => censor()}
          >
            Censor
          </Button>
          <Button
            disabled={disableControls}
            loading={status == 'validating'}
            type="valid"
            onClick={() => validate()}
          >
            Valid
          </Button>
        </div>
        <Button
          disabled={loading}
          loading={status == 'skipping'}
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
