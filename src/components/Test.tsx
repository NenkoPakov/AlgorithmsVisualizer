import React from 'react'
import styled from 'styled-components'

const Parent = styled.div`
width: 500px;
height: 600px;
background-color: green;
`;

const Child = styled.div`
max-width: 300px;
max-height: 300px;
aspect-ratio:1;
background-color: red;
`;

const GrandChild = styled.div`
width: 10%;
height: 10%;
background-color: green;
`;

const GrandGrandChild = styled.div`
position:relative;
height:min(var(--height),var(--width));
aspect-ratio:1;
background-color:white;
`;

function Test() {
  return (
      <Parent>
        <Child />
        {/* <GrandChild />
        <GrandChild />
        <GrandChild />
        <GrandChild />
        <GrandChild />
        <GrandChild />
        <GrandChild />
        <GrandChild />
        <GrandChild />
        <GrandChild />
        <GrandChild />
        <GrandChild />
        <GrandChild />
        <GrandChild />
        <GrandChild />
        <GrandChild />
        <GrandChild />
        <GrandChild />
        <GrandChild /> */}
      </Parent>
  )
}

export default Test