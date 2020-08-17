import React, {Component, Fragment} from 'react';
import axios from "axios";
import Footer from './footer';
import Header from './header';

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;

class Layout extends Component {

    state = {
        companyInfo: null        
    };

    componentDidMount() {
        this.getCompanyInfo();
    }

    getCompanyInfo() {
        axios
            .get(`${base}/api/getCompanyInfo`)
            .then(res => this.setState({ companyInfo: res.data[0] }));
    }

    render() {
                
        return (
            <Fragment>
                {this.state.companyInfo && 
                    <Header companyInfo={this.state.companyInfo}/> 
                }
                    
                    {this.props.children}

                {this.state.companyInfo && 
                    <Footer companyInfo={this.state.companyInfo}/>
                }
            </Fragment>
        )
    }
}

export default Layout;