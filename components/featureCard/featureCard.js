import React from 'react'
import Range from '../range/range'
import { AiFillQuestionCircle } from 'react-icons/ai'
import { IoClose } from 'react-icons/io5'

const FeatureCard = ({ key, title, param1, param2, value1, value2, text, unknown, na }) => {
    return (
        <div key={key} className='relative border rounded-lg py-3 px-4 h-[190px] overflow-hidden bg-white cursor-pointer hover:shadow-lg'>
            <p className='uppercase font-bold text-sm tracking-wide'>{title}</p>

            {!unknown && !na &&
                <>
                    <div className='mt-4'>
                        <p className='text-[14px] text-[#616161]'>{param1}</p>
                        <Range percent={value1} color={"#434343"} />
                    </div>

                    <div className='mt-2'>
                        <p className='text-[14px] text-[#616161]'>{param2}</p>
                        <Range percent={value2} color={"#3F51B5"} />
                    </div>
                </>
            }

            {
                unknown &&
                <div className='mt-8'>
                    <div className='text-[#616161] inline-flex gap-2 items-center text-sm border-b border-dotted border-black'>
                        <AiFillQuestionCircle size={16} />
                        <p>Unknown. Help us by suggesting a value.</p>
                    </div>
                    <div className='mt-2 text-[#616161] inline-flex gap-2 items-center text-sm border-b border-dotted border-black'>
                        <AiFillQuestionCircle size={16} />
                        <p>Unknown. Help us by suggesting a value.</p>
                    </div>
                </div>
            }

            {
                na &&
                <div className='mt-8 flex flex-col'>
                    <div className='text-[#616161] inline-flex gap-2 items-center text-sm'>
                        <IoClose size={22} color='#3F51B5' />
                        <p className='text-[#616161]'>Vivo Y29s</p>
                    </div>
                    <div className='mt-2 text-[#616161] inline-flex gap-2 items-center text-sm'>
                        <IoClose size={22} color='#3F51B5' />
                        <p className='text-[#616161]'>Vivo Y39 5G</p>
                    </div>
                </div>
            }

            <p className='text-[14px] text-[#616161] mt-8'>{text}</p>

            <div className='absolute bottom-0 left-0 w-full h-5 bg-gradient-to-t from-white to-transparent rounded-b-lg'></div>
        </div >
    )
}

export default FeatureCard