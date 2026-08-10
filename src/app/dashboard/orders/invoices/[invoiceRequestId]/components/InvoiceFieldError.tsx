interface InvoiceFieldErrorProps {
  id: string;
  message?: string;
}

export default function InvoiceFieldError({
  id,
  message,
}: InvoiceFieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}
