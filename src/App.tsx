import React from 'react';
import styled from 'styled-components';
import "./App.css";
import BoardProvider from './components/BoardContext';
import BoardManager from './components/BoardManager';

import Test from './components/Test';

const Layout = styled.div`
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  height:100%;
  overflow:hidden;
  `;

function App() {
  return (
    <Layout>
      <BoardProvider>
        <BoardManager />
      </BoardProvider>
      {/* <Test></Test> */}
    </Layout>
  );
}

export default App;
