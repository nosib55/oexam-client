"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PublicProfile from '../components/publicProfile/publicProfile';
const ProfilePage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id'); 
  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    if (userId) {
      fetch(`/api/user/profile?id=${userId}`)
        .then(res => res.json())
        .then(data => setProfileUser(data));
    }
  }, [userId]);

  if (!profileUser) return <p className="text-center mt-20">Loading Profile...</p>;

  return <PublicProfile user={profileUser} isVerified={profileUser.isVerified} />;
};

export default ProfilePage;