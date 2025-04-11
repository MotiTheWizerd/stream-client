import React from 'react';
import { useRouter } from 'next/router';
import FeaturedContent from '../components/FeaturedContent';
import UserProfile from '../components/UserProfile';

const HomePage = () => {
  const router = useRouter();

  const goToUserProfile = () => {
    router.push('/user-profile');
  };

  return (
    <div className="relative">
      <button
        onClick={goToUserProfile}
        className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-500 transition-colors z-10"
      >
        Go to Profile
      </button>
      <UserProfile />
      <FeaturedContent />
    </div>
  );
};

export default HomePage;
