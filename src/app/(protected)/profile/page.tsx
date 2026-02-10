import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/db/profile";
import ProfileClient from "./ProfileClient";

const ProfilePage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const profileData = await getUserProfile(session.user.id);

  if (!profileData) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p>Unable to load profile</p>
      </div>
    );
  }

  return <ProfileClient profileData={profileData} />;
};

export default ProfilePage;
