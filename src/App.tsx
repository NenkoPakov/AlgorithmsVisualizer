import React from 'react';
import styled from 'styled-components';
import BoardProvider from './components/BoardContext';
import BoardManager from './components/BoardManager';

const Layout = styled.div`
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  padding: 10px;
  `;

function App() {

  return (
    <Layout>
      <BoardProvider>
        <BoardManager />
      </BoardProvider>
    </Layout>
  );
}

export default App;
