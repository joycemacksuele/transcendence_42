import { RegisterForm } from '../components/forms/RegisterForm';

const Chat = () => {
    const myMargin = { margin: '5% 0 5% 0', padding: '3% 0 3% 0', backgroundColor: 'lightgreen', width: '40%'};
    return (
        <div style={myMargin}>
            Write a message:
            <form>
                <RegisterForm />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;