import { Component, ReactNode } from "react";

class Button extends Component<{label:string,handleClick:()=>void},{}>{
    
    render(): ReactNode {
        const {label}=this.props;
       return <button className="btn" onClick={()=>{this.props.handleClick()}}>{label}</button>
    }
}
  
  export default Button;
  