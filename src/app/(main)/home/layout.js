import { getLoggedInUserWithFriends } from "@/actions/chatActions";
import HomeLayoutWrapper from "@/components/chat/HomeLayoutWrapper";

export default async function HomeLayout({ children }) {
      const response = await getLoggedInUserWithFriends();
  
      const friends = response?.success ? response?.data?.friends : [];
      const loggedInUser = response?.success ? response?.data?.loggedInUser : null;
  
  return (
    <div className="w-full relative">
      <main>
        <HomeLayoutWrapper friends={friends} loggedInUser={loggedInUser}>
          {children}
        </HomeLayoutWrapper>
      </main>
    </div>
  );
}
