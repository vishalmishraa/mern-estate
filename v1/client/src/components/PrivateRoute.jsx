import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
export default function PrivateRoute() {
    const {currentUser} = useSelector(state => state.user);
  return (
    currentUser ? <Outlet/> : <Navigate to='/sign-in'></Navigate>
  )
}

export const UserLogedIn = () => {
  const {currentUser} = useSelector(state => state.user);
    return (
      currentUser ?  <Navigate to='/profile'></Navigate> : <Outlet/> 
    )
}
