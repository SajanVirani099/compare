import React from "react";

const products = [
    {
        name: "Vivo Y29s",
        items: [
            {
                title: "Vivo Y29 5G (Glacier Blue, 6GB RAM, 128GB Storage) with No Cost EMI/Additional Exchange Offers",
                price: 15499,
            },
            {
                title: "Vivo Y29 5G (Diamond Black, 8GB RAM, 128GB Storage) with No Cost EMI/Additional Exchange Offers",
                price: 16999,
            },
            {
                title: "Vivo Y29 5G (Glacier Blue, 4GB RAM, 128GB Storage) with No Cost EMI/Additional Exchange Offers",
                price: 13999,
            },
            {
                title: "Vivo Y29 5G (Titanium Gold, 8GB RAM, 256GB Storage) with No Cost EMI/Additional Exchange Offers",
                price: 18999,
            },
        ],
    },
    {
        name: "Vivo Y39 5G",
        items: [
            {
                title: "Vivo Y29 5G (Glacier Blue, 6GB RAM, 128GB Storage) with No Cost EMI/Additional Exchange Offers",
                price: 15499,
            },
            {
                title: "Vivo Y300 5G (Titanium Silver, 8GB RAM, 256GB Storage) with No Cost EMI/Additional Exchange Offers",
                price: 23999,
            },
            {
                title: "Vivo Y58 5G (Sunderbans Green, 8GB RAM, 128GB Storage) with No Cost EMI/Additional Exchange Offers",
                price: 16448,
            },
            {
                title: "Vivo Y29 5G (Titanium Gold, 8GB RAM, 256GB Storage) with No Cost EMI/Additional Exchange Offers",
                price: 18999,
            },
        ],
    },
];

const PriceComparison = () => {
    return null
    return (
        <div className="max-w-[1280px] w-[95%] md:w-[75%] lg:w-[55%] md:mx-auto p-6 mt-6">
            <h2 className="text-3xl font-bold mb-4">
                <span className="border-b border-black">Pri</span>ce comparison
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                {products.map((productCategory, index) => (
                    <div key={index}>
                        <h3 className="text-lg font-bold mb-2 text-[#616161]">
                            {productCategory.name}
                        </h3>
                        <div>
                            {productCategory.items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center justify-between gap-6 ${
                                        idx % 2 === 1 ? "bg-[#f9fafb]" : ""
                                    } p-2 rounded-md mb-2`}
                                >
                                    <p className="text-xs">{item.title}</p>
                                    <div className="flex items-center gap-1 mr-8">
                                        <img
                                            src="/amazon.png"
                                            alt="Amazon"
                                            className="h-4 mr-2"
                                        />
                                        <div
                                            className={`px-5 py-2 text-white text-md font-bold rounded-full ${
                                                idx === 0
                                                    ? "bg-[#3F51B5]"
                                                    : "bg-[#434343]"
                                            }`}
                                        >
                                            ₹{item.price}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PriceComparison;
