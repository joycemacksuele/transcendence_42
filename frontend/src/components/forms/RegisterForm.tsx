
import styled from 'styled-components';

const MyInputField = styled.input``;    // A little window for inputting text

const ExampleInputField = () => {
    return (
        <>
            <p>Example Input Field:</p>
            <form>
                <MyInputField />
            </form>
            <hr />
        </>
    );
}

export default ExampleInputField