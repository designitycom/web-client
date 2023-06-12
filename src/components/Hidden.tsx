import { Component, ReactNode } from "react";

class Hidden extends Component<{children:ReactNode},{}>{
    
    render(): ReactNode {
        const {children}=this.props;
       return <div className="hidden">{children}</div>
    }
}
  
  export default Hidden;
  