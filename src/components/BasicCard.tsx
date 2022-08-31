import React from 'react'
import styled from 'styled-components'
import Card from './Card';

const Data = styled.h2`
    margin:0;
    text-transform:capitalize;
`;

const Title = styled.h4`
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