interface ErrorMessageProps {
  message?: string;
  title?: string;
}

export default function ErrorMessage({
  message = "Ocurrió un error inesperado",
  title = "Error",
}: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-red-600 font-semibold">{title}</p>
        {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
      </div>
    </div>
  );
}
