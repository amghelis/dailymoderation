import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="w-screen text-center p-6 flex flex-col justify-center items-center gap-4">
      <h1 className="text-4xl font-bold">😵‍💫 Oups</h1>
      <p className="text-2xl">An error has occured</p>
      <Link
        className="text-2xl font-semibold border-2 border-black w-fit p-2 rounded-md"
        to="/"
      >
        Go back
      </Link>
    </div>
  );
};

export default ErrorPage;
