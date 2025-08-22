import React from 'react';
import Home from '../sections/Home';
import About from '../sections/About';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';
import Experience from '../sections/Experience';
const Page: React.FC = () => {
    return (
        <main>
            <Home />
            <About />
            <Experience />
            <Projects />
            <Contact />
        </main>
    );
};

export default Page;
    