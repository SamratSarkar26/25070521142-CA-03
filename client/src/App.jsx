import { Routes, Route } from 'react-router-dom';
import Nav from './nav';
import Create from './create';
import Login from './login';
import Home from './home';
import Courses from './courses';
import Students from './students';
import About from './about';

const App = () => {

  return (

    <>

        <Nav/>

        <Routes>

          <Route path = "/" element = {<Create/>}></Route>
          <Route path = "/login" element = {<Login/>}></Route>
          <Route path = "/home" element = {<Home/>}></Route>
          <Route path = "/courses" element = {<Courses/>}></Route>
          <Route path = "/students" element = {<Students/>}></Route>
          <Route path = "/about" element = {<About/>}></Route>

        </Routes>

    </>
  )
}

export default App;

