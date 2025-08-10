import { NavLink } from "react-router-dom";
import { FaUserCircle } from 'react-icons/fa';

export default function Header() {
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <div className="navbar-nav">
                    <img src="/logo.png" alt="logo" height="40px" width="40px" style={{margin: '5px 10px', marginLeft: '10px'}}/>
                    <NavLink className="nav-item nav-link" to="/pantry" style={{color: 'white', margin: '5px 10px'}}>My Pantry</NavLink>
                    <NavLink className="nav-item nav-link" to="/cookbook" style={{color: 'white', margin: '5px 10px'}}>My Cookbook</NavLink>
                    <NavLink className="nav-item nav-link" to="/smart_recipe" style={{color: 'white', margin: '5px 10px'}}>Smart Recipe</NavLink>
                    <NavLink className="nav-item nav-link" to="/grocery_list" style={{color: 'white', margin: '5px 10px'}}>Grocery List</NavLink>
                </div>
                {/* add a link */}
                {/* <FaUserCircle size={30} style={{color: "white", marginRight: '10px'}} /> */}
            </div>
        </nav>
    )
}