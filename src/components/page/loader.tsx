import Image from "next/image";

export default function Loader({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  return (
    <Image
      src="/icons/loader"
      width={width}
      height={height}
      className="animate-spin"
      alt=""
    />
  );
}
