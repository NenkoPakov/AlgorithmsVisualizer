import React from 'react'
import styled from 'styled-components'

const Parent = styled.div`
position:relative;
width:100%;
height:100%;
background-color:lightcoral;
`;

const Child = styled.div`
position: relative;
width:40%;
height:30%;
/* --width:var(--width);
--height:var(--height); */
background-color:green;

`;

const GrandChild = styled.div`
position:relative;
/* height:50%;
width:50%; */
--height:calc(width/2);
--width:calc(height/2);
background-color:red;
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
      <Child>
        <GrandChild>
          <GrandGrandChild>

          </GrandGrandChild>
        </GrandChild>
      </Child>
    </Parent>
  )
}

export default Test