import ArrowSpinner from '../loader/ArrowSpinner';

type ButtonProps = {
  type: 'censor' | 'valid' | 'skip';
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  type,
  disabled,
  loading,
  onClick,
  children,
}) => {
  const content = loading ? <ArrowSpinner /> : children;

  return (
    <button
      className={`${type} flex-1`}
      disabled={disabled || loading}
      onClick={() => onClick()}
    >
      {content}
    </button>
  );
};

export default Button;
