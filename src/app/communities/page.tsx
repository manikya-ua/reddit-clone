import CommunityList from "@/components/page/community-list";
import { getUser } from "@/lib/server-actions";

export default async function Page() {
  const { user } = await getUser();
  return (
    <div className="flex-1 flex flex-col gap-5 px-7 py-5 w-full max-w-2xl mx-auto">
      <h1 className="text-2xl">Manage Communities</h1>
      <CommunityList user={user} />
    </div>
  );
}
