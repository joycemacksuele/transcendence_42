import { ChatInputField } from '../forms/chatForm.tsx';

const Chat = () => {
    const myMargin = { margin: '5% 0 5% 0', padding: '3% 0 3% 0', backgroundColor: 'lightgreen', width: '40%'};

    // <ChatInputField />  THIS IS NOT WORKING :/
    return (
        <div style={myMargin}>
            <b>Chat form:</b> Write a message:
            <form>
                <ChatInputField />
            </form>
        </div>
    );
};

export default Chat;