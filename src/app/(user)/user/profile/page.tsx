"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { userApiClient } from "@/infrastructure/user/userAPIClient";
import { Mail, User2 } from "lucide-react";
import Loading from "@/components/loading/Loading";
import { user_role } from "@/constants/role";

interface UserProfile {
  email: string;
  kind: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userApiClient.getUserProfile();
        setProfile(data);
      } catch (err) {
        setError("プロフィールの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p className="text-red-400 text-center mt-10">{error}</p>;
  }

  return (
    <div className="min-h-screen main_gradient_bg flex items-center justify-center px-4 py-20">
      <div className="glass-card p-8 rounded-lg shadow-lg w-full max-w-md text-white text-center">
        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-400 transition-colors duration-300 bg-gray-100">
            <Image
              src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
              alt="User Profile"
              width={80}
              height={80}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">プロフィール</h2>

        <div className="space-y-4 text-left">
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-blue-400" />
            <span className="text-sm text-gray-300">メールアドレス:</span>
          </div>
          <p className="text-lg font-medium ml-6">{profile?.email}</p>

          <div className="flex items-center gap-2 mt-4">
            <User2 size={18} className="text-blue-400" />
            <span className="text-sm text-gray-300">ユーザー種別:</span>
          </div>
          <p className="text-lg font-medium ml-6">
            {profile?.kind === user_role.USER ? "END USER" : "SUPER ADMIN"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
