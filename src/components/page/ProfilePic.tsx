export default function ProfilePic({ firstChar }: { firstChar: string }) {
  return (
    <div className="size-6 flex items-center justify-center rounded-full select-none ring ring-neutral-500">
      {firstChar}
    </div>
  );
}
