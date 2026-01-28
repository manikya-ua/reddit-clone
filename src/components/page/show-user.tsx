"use client"
import { useGetUser } from "../hooks/useGetUser";

export default function ShowUser() {
  const { data: user, isLoading } = useGetUser();
  return (
    <div>
      {isLoading && "Loading..."}
      {user?.email}
    </div>
  );
}
