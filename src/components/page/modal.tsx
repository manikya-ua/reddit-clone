export default function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 max-w-135">
      {children}
    </div>
  );
}
