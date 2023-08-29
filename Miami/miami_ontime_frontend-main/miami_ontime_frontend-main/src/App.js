import UF_logo from './image/university-of-florida-logo-532x336-1.webp';
import lab_logo from './image/Lab logo.jpg';
import { DateTimePickerValue, FixedContainer, BasicTable, ControlledSwitches, BoxSx, ContextProvider, InsetDividers, BasicButtons, AVGDelay, DialogSelect, Issue_button } from './mui';
import { LineChart, BarChart } from './chart';
import Map from './map';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LimitText } from './other'

import './App.css';

function App() {
  return (
    <div>
      <ToastContainer />
      <div className='screen-layout'>
        <ContextProvider>
          <div className='column-layout'>
            <div className="logo-container">
              <img src={UF_logo} alt="UF_logo" className="UF_logo" />
              <img src={lab_logo} alt="lab_logo" className="Lab_logo" />
            </div>
            <FixedContainer>
              <h1 className="header-text">Miami Bus On Time</h1>
              <h3 className="text">Select date range:</h3>
              <div className="date-time-window">
                <DateTimePickerValue />
              </div>
              <div className='text'><LimitText /></div>
              <div className='selector'><DialogSelect /></div>
              <div className='button'><BasicButtons /></div>
              <h3 className="text2">Top 5 most serious delay routes:</h3>
              <div className='table'><BasicTable /></div>
              <div className='box'>
              <BoxSx>
                <AVGDelay />
              </BoxSx>
            </div>
            </FixedContainer>
          </div>
          <Map />
          <div className='column-layout-2'>
            {/* <div className='switch'><ControlledSwitches /></div> */}
            <InsetDividers />
            <div className='bar-chart'><BarChart /></div>
            <h3 className='text3'>Delay time by hours:</h3>
            <div className='line-chart'><LineChart /></div>
            <div className='issue-button'><Issue_button /></div>
          </div>
        </ContextProvider>
      </div>
    </div>
  );
}

export default App;
