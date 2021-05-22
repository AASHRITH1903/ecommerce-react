import React from "react"
import { Redirect } from "react-router";

import withContext from "../withContext"

class Login extends React.Component{

    constructor(props){
        super(props);
        this.state={
            username : "",
            password : ""
        }
    }

    handleChange = (e) => {
        e.preventDefault();
        this.setState({[e.target.name] : e.target.value})
    }

    login = (e) => {
        e.preventDefault();
        //const {username , password} = this.state;
        this.props.context.login(this.state.username, this.state.password)
        .then((success) => {
            if(!success){
                console.log("not success");
                this.setState({error : "Invalid Credentials"})
            }
        })
    }

    render(){
        console.log(this.state);

        return !(this.props.context.user) ? 

                (

                    <div>
                        <form onSubmit={this.login}>
                            <label className="label">Email : </label>
                            <input className="input" name="username" type="email" onChange={this.handleChange} />
                            <label className="label">Password : </label>
                            <input className="input" name="password" type="password" onChange={this.handleChange} />
                            <button>submit</button>
                        </form>

                        {this.state.error && <div className="has-text-danger">{this.state.error}</div> }

                    </div>

                )
                :
                (
                    <Redirect to="/products"/>
                )

    }

}

export default withContext(Login)