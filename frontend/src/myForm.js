import React, { useState } from 'react';
import axios from 'axios';

const MyComponent = () => {

  const myMargin = { marginTop: '5%' };

  const [name, setName] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users', { name, city });
      console.log(response.data); // Handle the response as needed
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <div style={myMargin}>
        <form onSubmit={handleSubmit}>
          <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
          />
          <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
  );
};

export default MyComponent;