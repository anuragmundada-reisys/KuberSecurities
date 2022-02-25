import React from 'react';
import ReactPlayer from 'react-player';
import classes from './Home.module.css'

const Home = () => {
     return(
         <div className={classes.PlayerWrapper}>
             <ReactPlayer
                 url='https://www.youtube.com/embed/zD1BrskVSXc'
                 className={classes.ReactPlayer}
                 playing={true}
                 muted={true}
                 width='80em'
                 height='40em'
             />
         </div>
     )
}

export default Home;
