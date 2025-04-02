import './ApplyMonitor.css';
import React from 'react';
import VerticalNavbar from './VerticalNavbar';
import TableContent from './TableContent';
import Dropdown from './Filters';
import { MyProvider } from './MyContext';

function ApplyMonitor() {
    console.log("ApplyMonitor se está renderizando");

    return (

            <div className="apply-monitor-container">
                <VerticalNavbar />
                
                <div className="title-container-apply-monitor">
                    <div className="title-apply-monitor">Postulación a Monitor</div>
                </div>
                
                <div className="apply-monitor-cont">
                     <MyProvider>
                        <Dropdown />
                        <TableContent />
                     </MyProvider>
                    
                </div> 
            </div>

    );
}

export default ApplyMonitor;