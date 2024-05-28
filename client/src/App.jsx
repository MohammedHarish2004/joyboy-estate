import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import Missing from './components/Missing'
import CreateListing from './pages/CreateListing'
import Dummy from './pages/Dummy'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import Search from './pages/Search'
import Footer from './components/Footer'
export default function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route element={<PrivateRoute/>}>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/create-listing' element={<CreateListing/>}/>
          <Route path='/update-listing/:listingId' element={<UpdateListing/>}/>
        </Route>
        <Route path='/about' element={<About/>}/>
        <Route path='/search' element={<Search />}/>
        <Route path='/listing/:listingId' element={<Listing/>}/>
        <Route path='/sign-in' element={<SignIn/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/dummy' element={<Dummy/>}/>
        <Route path='*' element={<Missing/>}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
