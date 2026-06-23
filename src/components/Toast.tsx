type ToastProps = {
  message: string;
};

export default function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-md bg-slate-950 px-4 py-3 text-center text-sm font-medium text-white shadow-soft no-print">
      {message}
    </div>
  );
}
