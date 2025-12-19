import React from 'react'

const Range = ({ percent, color }) => {
    return (
        <div className="w-full h-2 rounded-full bg-[#BEBEBE]">
            <div className={`bg-[${color}] h-full rounded-full`} style={{width: `${percent}%`}}></div>
        </div>
    )
}

export default Range