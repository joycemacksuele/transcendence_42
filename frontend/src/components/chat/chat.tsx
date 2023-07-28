import { ChatInputField } from '../forms/chatForm.tsx';

const Chat = () => {
    const myMargin = { margin: '5% 0 5% 0', padding: '3% 0 3% 0', backgroundColor: 'lightgreen', width: '40%'};

    return (
        <div style={myMargin}>
            <b>Chat form:</b> Write a message:
            <form>
                <ChatInputField /> -> THIS IS NOT WORKING :/
            </form>
        </div>
    );
};

export default Chat;