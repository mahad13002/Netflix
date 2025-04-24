import React from 'react'
import Main from '../components/Main'
import Row from '../components/Row'
import requests from '../Requests'

const Home = () => {
  return (
    <>
        <Main />
        <Row rowID='1' title="UpComing" fetchURL={requests.requestUpcoming} />        
        <Row rowID='2' title="Action" fetchURL={requests.requestAction} />
        <Row rowID='3' title="Top Rated" fetchURL={requests.requestTopRated} />
        <Row rowID='4' title="Trending" fetchURL={requests.requestTrending} />
        <Row rowID='5' title="Popular" fetchURL={requests.requestPopular} />
    </>
  )
}

export default Home