import React from "react";
import ComparisonSummaryPoint from "../comparisonSummaryPoint/comparisonSummaryPoint";
import { MdKeyboardArrowRight } from "react-icons/md";

const comparisonItem1Points = [
    {
        feature: "Audio",
        point: "Has a radio",
        subpoint: "",
        tooltip:
            "A built-in FM radio tuner allows you to listen to most of the live-broadcasted FM radio stations without usi the internet.",
    },
    {
        feature: "Performance",
        point: "Has an external memory slot",
        subpoint: "",
        tooltip:
            "The device has a standard memory slot (such as an SD or micro SD card slot) that enables you to extend the built-in intemal storage with affordable memory modules, or easily retrieve data, such as photographs, from the memory card.",
    },
    {
        feature: "Audio",
        point: "Has stereo speakers",
        subpoint: "",
        tooltip:
            "Devices with stereo speakers deliver sound from independent channels on both left and right sides, creating a richer sound and a better experience.",
    },
    {
        feature: "Features",
        point: "32% faster downloads",
        subpoint: "3300 MBits/s vs 2500 MBits/s",
        tooltip:
            "This is the maximum download speed supported. In reality, the download speed will usually be lower, as it will be affected by other factors (such as your home/mobile network speeds).",
    },
    {
        feature: "Features",
        point: "0.3 newer Bluetooth version",
        subpoint: "5.4 vs 5.1",
        tooltip:
            "Bluetooth is a wireless technology standard that allows data transfers between devices placed in close proximity, using short-wavelength, ultra-high frequency radio waves. Newer versions provide faster data transfers.",
    },
    {
        feature: "Performance",
        point: "Uses multithreading",
        subpoint: "",
        tooltip:
            "Multithreading technology (such as Intel's Hyperthreading or AMD's Simultaneous Multithreading) provides increased performance by splitting each of the processor's physical cores into virtual cores, also known as threads. This way, each core can run two instruction streams at once.",
    },
];

const comparisonItem2Points = [
    {
        feature: "Battery",
        point: "18.18% more battery power",
        subpoint: "6500 mAh vs 5500 mAh",
        tooltip:
            "Battery power, or battery capacity, represents the amount of electrical energy that a battery can store. More battery power can be an indication of longer battery life.",
    },
    {
        feature: "Cameras",
        point: "1.6x more megapixels (front camera)",
        subpoint: "8MP vs 5MP",
        tooltip:
            "The number of megapixels determines the resolution of the images captured with the front camera. A higher megapixel count means that the front camera is capable of capturing more details, an essential factor for taking high-resolution selfies.",
    },
    {
        feature: "Design",
        point: "190.9 g lighter",
        subpoint: "8.1 g vs 199 g",
        tooltip:
            "We consider a lower weight better because lighter devices are more comfortable to carry. A lower weight is also an advantage for home appliances, as it makes transportation easier, and for many other types of products.",
    },
    {
        feature: "Display",
        point: "33.33% higher refresh rate",
        subpoint: "120Hz vs 90Hz",
        tooltip:
            "The frequency at which the display is refreshed (1 Hz = once per second). A higher refresh rate results in smoother UI animations and video playback.",
    },
    {
        feature: "Features",
        point: "Has a gyroscope",
        subpoint: "",
        tooltip:
            "A gyroscope is a sensor that tracks the orientation of a device, more specifically by measuring the angular rotational velocity. Initially, they were built using a spinning rotor to detect changes in orientation, like twisting or rotation.",
    },
    {
        feature: "Performance",
        point: "2 nm smaller semiconductor size",
        subpoint: "4 nm vs 6 nm",
        tooltip:
            "Small semiconductors provide better performance and reduced power consumption. Chipsets with a higher number of transistors, semiconductor components of electronic devices, offer more computational power. A small form factor allows more transistors to fit on a chip, therefore increasing its performance.",
    },
    {
        feature: "Battery",
        point: "29W higher charging speed",
        subpoint: "44W vs 15W",
        tooltip:
            "Charging speeds are expressed in watts (W), a measure of electrical power. A higher wattage results in a faster charging speed. In order to achieve the advertised charging speed, it is important to use a compatible charger.",
    },
    {
        feature: "Performance",
        point: "1067 MHz higher RAM speed",
        subpoint: "3200 MHz vs 2133 MHz",
        tooltip:
            "It can support faster memory, which will give quicker system performance.",
    },
];

const ComparisonSummary = ({
    comparisonItem1,
    comparisonItem2,
    selectedFeature,
}) => {
    return (
        <div className="mt-10 pl-10 md:pl-0">
            <p className="font-bold text-lg">
                Why is {comparisonItem1} better than {comparisonItem2}?
            </p>

            {!selectedFeature && (
                <div className="px-2 mt-3 space-y-2">
                    {comparisonItem1 == "Vivo Y29s"
                        ? comparisonItem1Points.map((point, index) => (
                              <ComparisonSummaryPoint
                                  key={index}
                                  point={point}
                              />
                          ))
                        : comparisonItem2Points.map((point, index) => (
                              <ComparisonSummaryPoint
                                  key={index}
                                  point={point}
                              />
                          ))}
                </div>
            )}

            {selectedFeature && (
                <div className="mt-4">
                    <div className="font-bold flex items-center">
                        <MdKeyboardArrowRight className="font-bold" />{" "}
                        {selectedFeature}
                    </div>
                    <div className="px-2 mt-3 space-y-2">
                        {comparisonItem1 == "Vivo Y29s"
                            ? comparisonItem1Points.map(
                                  (point, index) =>
                                      selectedFeature == point.feature && (
                                          <ComparisonSummaryPoint
                                              key={index}
                                              point={point}
                                          />
                                      )
                              )
                            : comparisonItem2Points.map(
                                  (point, index) =>
                                      selectedFeature == point.feature && (
                                          <ComparisonSummaryPoint
                                              key={index}
                                              point={point}
                                          />
                                      )
                              )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComparisonSummary;
