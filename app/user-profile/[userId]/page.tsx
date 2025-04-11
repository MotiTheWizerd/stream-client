import { use } from "react";
import UserProfile from "../../components/UserProfile";

async function getUserProfileParams(params: { userId: string }) {
  return params;
}

export default function UserProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = use(getUserProfileParams(params));
  
  return (
    <div>
      <UserProfile userId={userId} />
    </div>
  );
}
