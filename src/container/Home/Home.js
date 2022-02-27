import React from 'react';
import ReactPlayer from 'react-player';
import classes from './Home.module.css'
import Footer from "../../component/Footer/Footer";

const Home = () => {
     return(
         <>
             <div>
                 <ReactPlayer
                     url='https://www.youtube.com/embed/zD1BrskVSXc'
                     className={classes.ReactPlayer}
                     playing={true}
                     muted={true}
                     width='80%'
                     height='70%'
                 />
             </div>
             <Footer currentYear={new Date().getFullYear()}/>
         </>
)
}

export default Home;
