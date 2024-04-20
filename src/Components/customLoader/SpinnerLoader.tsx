import React from 'react';
import './spinnerLoader.css';

const SpinnerLoader = () => {
    return (
        <div className='spinner-wrapper w-[18px] h-[18px]'>
            <div className='spinner w-full h-full'>
                <div className='w-full h-full'></div>
            </div>
        </div>
    );
};

export default SpinnerLoader;
