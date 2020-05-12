import React from 'react';
import { Header, Title, Button, Left, Right, Body, Icon, } from 'native-base';
import { Image } from 'react-native';

export const Navbar = () => (
    <Header>
        <Left>
            <Button transparent>
                <Image source={require('../logo.png')} style={{width: 30, height: 40}}/>
            </Button>
        </Left>
        <Body>
            <Title>Спасатель</Title>
        </Body>
        <Right />
    </Header>
)
