import React from 'react'
import Range from '../range/range'
import { AiFillQuestionCircle } from 'react-icons/ai'
import { IoClose } from 'react-icons/io5'

const FeatureCard = ({ key, title, param1, param2, param3, value1, value2, value3, text, unknown, na, product1Name, product2Name, product3Name, colors = ["#434343", "#3F51B5", "#10B981"] }) => {
    // Determine how many products we have
    const hasParam1 = param1 && param1 !== "N/A" && param1 !== "Unknown";
    const hasParam2 = param2 && param2 !== "N/A" && param2 !== "Unknown";
    const hasParam3 = param3 && param3 !== "N/A" && param3 !== "Unknown";
    const productCount = [hasParam1, hasParam2, hasParam3].filter(Boolean).length;

    return (
        <div key={key} className='relative border py-3 px-4 h-[190px] overflow-hidden border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-inset cursor-pointer hover:shadow-lg'>
            <p className='uppercase font-bold text-sm tracking-wide'>{title}</p>

            {!unknown && !na &&
                <>
                    {hasParam1 && (
                    <div className='mt-4'>
                        <p className='text-[14px] text-[#616161]'>{param1}</p>
                            <Range percent={value1 || 0} color={colors[0]} />
                    </div>
                    )}

                    {hasParam2 && (
                        <div className={hasParam1 ? 'mt-2' : 'mt-4'}>
                        <p className='text-[14px] text-[#616161]'>{param2}</p>
                            <Range percent={value2 || 0} color={colors[1]} />
                        </div>
                    )}

                    {hasParam3 && (
                        <div className={(hasParam1 || hasParam2) ? 'mt-2' : 'mt-4'}>
                            <p className='text-[14px] text-[#616161]'>{param3}</p>
                            <Range percent={value3 || 0} color={colors[2]} />
                    </div>
                    )}
                </>
            }

            {
                unknown &&
                <div className='mt-8'>
                    {product1Name && (
                        <div className='text-[#616161] inline-flex gap-2 items-center text-sm border-b border-dotted border-black'>
                            <AiFillQuestionCircle size={16} />
                            <p>Unknown. Help us by suggesting a value. ({product1Name})</p>
                        </div>
                    )}
                    {product2Name && (
                        <div className={`text-[#616161] inline-flex gap-2 items-center text-sm border-b border-dotted border-black ${product1Name ? 'mt-2' : ''}`}>
                            <AiFillQuestionCircle size={16} />
                            <p>Unknown. Help us by suggesting a value. ({product2Name})</p>
                        </div>
                    )}
                    {product3Name && (
                        <div className={`text-[#616161] inline-flex gap-2 items-center text-sm border-b border-dotted border-black ${(product1Name || product2Name) ? 'mt-2' : ''}`}>
                            <AiFillQuestionCircle size={16} />
                            <p>Unknown. Help us by suggesting a value. ({product3Name})</p>
                        </div>
                    )}
                    {!product1Name && !product2Name && !product3Name && (
                        <>
                    <div className='text-[#616161] inline-flex gap-2 items-center text-sm border-b border-dotted border-black'>
                        <AiFillQuestionCircle size={16} />
                        <p>Unknown. Help us by suggesting a value.</p>
                    </div>
                    <div className='mt-2 text-[#616161] inline-flex gap-2 items-center text-sm border-b border-dotted border-black'>
                        <AiFillQuestionCircle size={16} />
                        <p>Unknown. Help us by suggesting a value.</p>
                    </div>
                        </>
                    )}
                </div>
            }

            {
                na &&
                <div className='mt-8 flex flex-col'>
                    {product1Name && (
                        <div className='text-[#616161] inline-flex gap-2 items-center text-sm'>
                            <IoClose size={22} color={colors[0]} />
                            <p className='text-[#616161]'>Ø {product1Name}: Not applicable</p>
                        </div>
                    )}
                    {product2Name && (
                        <div className={`text-[#616161] inline-flex gap-2 items-center text-sm ${product1Name ? 'mt-2' : ''}`}>
                            <IoClose size={22} color={colors[1]} />
                            <p className='text-[#616161]'>Ø {product2Name}: Not applicable</p>
                        </div>
                    )}
                    {product3Name && (
                        <div className={`text-[#616161] inline-flex gap-2 items-center text-sm ${(product1Name || product2Name) ? 'mt-2' : ''}`}>
                            <IoClose size={22} color={colors[2]} />
                            <p className='text-[#616161]'>Ø {product3Name}: Not applicable</p>
                        </div>
                    )}
                    {!product1Name && !product2Name && !product3Name && (
                        <>
                    <div className='text-[#616161] inline-flex gap-2 items-center text-sm'>
                                <IoClose size={22} color={colors[0]} />
                                <p className='text-[#616161]'>Product 1: Not applicable</p>
                    </div>
                    <div className='mt-2 text-[#616161] inline-flex gap-2 items-center text-sm'>
                                <IoClose size={22} color={colors[1]} />
                                <p className='text-[#616161]'>Product 2: Not applicable</p>
                    </div>
                        </>
                    )}
                </div>
            }

            <p className='text-[14px] text-[#616161] mt-8'>{text}</p>

            <div className='absolute bottom-0 left-0 w-full h-5 bg-gradient-to-t from-white to-transparent rounded-b-lg'></div>
        </div >
    )
}

export default FeatureCard