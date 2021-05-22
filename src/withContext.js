import React from "react"
import Context from "./Context"

export default function(MyComponent){
    return function(props){
        return(
            <Context.Consumer>
                { (context) => <MyComponent {...props} context={context} /> }
            </Context.Consumer>
        )
    }
}