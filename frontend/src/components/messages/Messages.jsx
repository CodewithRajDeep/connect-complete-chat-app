import useGetMessages from '../../hooks/useGetConversations';
import Message from "./Message.jsx";
const Messages = () => {
  const {messages, loading} = useGetMessages();
  console.log("messages:", messages);
  return (
    <div className="px-4 flex-1 overflow-auto">
    <Message/>
    <Message/>
    <Message/>
    <Message/>
    <Message/>
    <Message/>
    <Message/>
    <Message/>
    <Message/>
    </div>
  )
}

export default Messages;
