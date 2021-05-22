import React from "react";
import { BrowserRouter as Router , Switch , Link , Route } from "react-router-dom"
import axios from "axios"
import jwt_decode from "jwt-decode"

import "./App.css";
import Context from "./Context";

import AddProduct from "./components/AddProduct";
import Cart from "./components/Cart";
import Login from "./components/Login"
import ProductList from "./components/ProductList"

export default class App extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            user : null,
            cart : {},
            products : [],
        }

        this.routerRef = React.createRef();
    }

    componentDidMount(){
        let user = localStorage.getItem("user")
        user = user ? JSON.parse(user) : null
        this.setState({user : user})
    }

    login = async (email , password) => {
        let res = await axios.post("http://localhost:3001/login", {
           email : email,
           password : password, 
        }).catch((err) => {
            return {
                status : 401,
                message : "not authorized"
            }
        })

        if(res.status === 200){
            let {email} = jwt_decode(res.data.accessToken)
            this.setState({
                user : {
                    email : email,
                    token : res.data.accessToken,
                    accessLevel : email === "admin@example.com" ? 0 : 1,
                }
            })
            return true;
        }else{
            return false;
        }
    }

    logout = (e) => {
        e.preventDefault()
        this.setState({user : null})
        localStorage.removeItem("user")
    }


    render(){
        return(
            <Context.Provider value={{

                ...this.state,
                removeFromCart : this.removeFromCart,
                addToCart : this.addToCart,
                login : this.login,
                addProduct : this.addProduct,
                clearCart : this.clearCart,
                checkout : this.checkout,

            }} >

                <Router ref={this.routerRef}>

                    <nav className="navbar container">
                        <div className="navbar-brand">
                            <b>E-commerce</b>

                            <label role="button" className="navbar-burger burger" onPress={e => {
                                e.preventDefault();
                                this.setState({showMenu : !this.state.showMenu})
                            }}>
                            </label>
                        </div>

                        <div className={`navbar-menu ${this.state.showMenu ? "is-active" : ""}`}>

                                <Link className="navbar-item" to="/addProduct">AddProduct</Link>
                            
                                <Link className="navbar-item" to="/cart">
                                    Cart 
                                    <span className="tag is-primary" style={{marginLeft : "5px"}}>
                                    {Object.keys(this.state.cart).length}
                                    </span>
                                </Link>

                                {
                                    !this.state.user 
                                    ? <Link className="navbar-item" to="/login"> Login </Link>
                                    : <Link className="navbar-item" to="/" onClick={this.logout}> Logout </Link>
                                }

                                <Link className="navbar-item" to="/products" >Products</Link>

                        </div>
                    </nav>

                    <Switch>
                        <Route exact path="/" component={ProductList} />
                        <Route exact path="/addProduct" component={AddProduct} />
                        <Route exact path="/cart" component={Cart} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/products" component={ProductList} />
                    </Switch>

                </Router>

            </Context.Provider>
        )
    }
}
