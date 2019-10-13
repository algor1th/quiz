import React from 'react';

function Progressbar(props) {
    console.log(props.fraction * 100)
    return (
        <div className='progressBar' style={{
            position: 'relative',
            height: '20px',
            width: '100vw',
            border: ' 1px solid black',
            backgroundColor: 'white'
        }}>
            <div className='filler' style={{
                height: '100%',
                transition: 'width 1s ease-in',
                width: `${props.fraction * 100}%`,
                backgroundColor: 'orange'
            }}></div>
        </div>
    )
}
export default Progressbar;