import Indeterminate from "./indeterminate";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <Indeterminate isLoading={true} />
    </div>
  );
}
