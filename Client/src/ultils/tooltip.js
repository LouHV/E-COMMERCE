// import React from 'react';

// const Tooltip = ({ content, isVisible }) => {
//     if (!isVisible) return null;
//     const tooltipStyle = {
//         position: 'absolute',
//         // backgroundColor: '#333',
//         // color: '#fff',
//         // padding: '5px 10px',
//         borderRadius: '6px',
//         fontSize: '14px',
//         zIndex: 1000,
//     };

//     return (
//         <div className="tooltip" style={tooltipStyle}>
//             {content}
//         </div>
//     );
// };

// export default Tooltip;


import React from 'react';

const Tooltip = ({ content, isVisible, onMouseLeave }) => {
    if (!isVisible) return null;
    const tooltipStyle = {
        position: 'absolute',
        borderRadius: '6px',
        fontSize: '14px',
        zIndex: 1000,
    };

    return (
        <div className="tooltip" style={tooltipStyle} onMouseLeave={onMouseLeave}>
            {content}
        </div>
    );
};

export default Tooltip;
