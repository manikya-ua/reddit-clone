export default function ProfilePic({ firstChar }: { firstChar: string }) {
  return (
    <div className="size-6 flex items-center justify-center rounded-full select-none">
      {firstChar}
    </div>
  );
}
