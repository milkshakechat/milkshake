export type ErrorLine = string;

export const ErrorLines = ({ errors }: { errors: ErrorLine[] }) => {
  if (errors && errors.length > 0) {
    return (
      <div>
        {errors.map((err) => (
          <span key={err} style={{ color: "red" }}>
            {err}
          </span>
        ))}
      </div>
    );
  }
  return null;
};
