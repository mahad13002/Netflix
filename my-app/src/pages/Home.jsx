import React from 'react';
import Main from '../components/Main';
import Row from '../components/Row';
import requests from '../Requests';

const Home = () => {
  return (
    <>
        <Main />
        <Row rowID='1' title="Upcoming" fetchURL={requests.requestUpcoming} />
        <Row rowID='2' title="Popular" fetchURL={requests.requestPopular} />        
        <Row rowID='3' title="Action" fetchURL={requests.requestAction} />
        <Row rowID='4' title="Horror" fetchURL={requests.requestHorror} /> 
        <Row rowID='5' title="Animated" fetchURL={requests.requestAnime} /> 
        <Row rowID='6' title="Comedy" fetchURL={requests.requestComedy} />
        <Row rowID='7' title="Documentary" fetchURL={requests.requestDocumentary} />
    </>
  );
};

export default Home;
