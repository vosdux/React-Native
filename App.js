import React from 'react';
import { Container, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { Navbar } from './components/Header';
import MainScreen from './components/MainScreen';

const App = () => {
  return (
    <>
      <Container>
        <Navbar />
        <MainScreen />
        <Footer>
          <FooterTab>
            <Button full>
              <Text>Footer</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    </>
  );
};


export default App;
