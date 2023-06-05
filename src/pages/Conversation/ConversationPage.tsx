import QuickNav from "@/components/QuickNav/QuickNav";
import { useSendBirdConnection } from "@/hooks/useSendbird";
import { ApplicationUserListQueryParams } from "@sendbird/chat";

const ConversationPage = () => {
  const { sendbird, loading } = useSendBirdConnection();

  if (!sendbird || loading) {
    return <div>Loading...</div>;
  }

  const listUsers = async () => {
    const queryParams: ApplicationUserListQueryParams = {
      limit: 20,
    };
    const query = sendbird.createApplicationUserListQuery(queryParams);
    const users = await query.next();
    console.log(users);
  };

  return (
    <div>
      <QuickNav />
      <h1>ConversationPage</h1>
      <br />
      <button onClick={() => listUsers()}>List Users</button>
    </div>
  );
};

export default ConversationPage;
