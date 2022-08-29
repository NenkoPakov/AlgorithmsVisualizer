import React from 'react'
import styled from 'styled-components'
import Card from './Card';

const Title = styled.h2`
    margin:0;
`;
const Data = styled.h4`
margin:0;
font-weight:400;
text-transform:capitalize;
color:#7e7e7e;
`;

function BasicCard({title,data}:any) {
  return (
    <Card>
        <Title>{title}</Title>
        <Data>{data}</Data>
    </Card>
  )
}

export default BasicCard