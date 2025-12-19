import React from 'react'
import { MdCheck } from 'react-icons/md'
import { AiFillQuestionCircle } from "react-icons/ai";
import { Tooltip } from 'antd';

const ComparisonSummaryPoint = ({ key, point }) => {
    return (
        <div key={key} className=''>
            <div className='flex items-center'>
                <MdCheck color={"#3c59fc"} />
                <p className='text-[#616161] ml-3 mr-2'>{point.point}</p>

                <Tooltip title={point.tooltip} placement="bottom" overlayInnerStyle={{ backgroundColor: 'white', color: 'black', fontSize: '12px' }} color="white">
                    <AiFillQuestionCircle size={20} className='text-gray-300 cursor-help' />
                </Tooltip>
            </div>
            <div>
                <p className='text-[#616161] pl-8 text-sm mt-1 italic'>{point.subpoint}</p>
            </div>
        </div>
    )
}

export default ComparisonSummaryPoint
