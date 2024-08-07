import { useRouteError } from "react-router-dom";

type ErrorType = {
  statusText?: string;
  message?: string;
};

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const typedError = error as ErrorType;

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{typedError.statusText || typedError.message}</i>
      </p>
    </div>
  );
}
