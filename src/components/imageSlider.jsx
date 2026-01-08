import { useState } from "react";

export default function ImageSlider(props){
    const images = props.images;
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    return(
        <div className="w-100 h-125 ">
            <img src={images[activeImageIndex]} className="w-full h-100 object-cover"/>
            <div className="w-full h-25 flex flex-row  items-center justify-center gap-0.5">
                {
                    images.map(
                        (image, index)=>{
                            return(
                                <img  src={image} key={index} className={"w-22.5 h-22.5 object-cover cursor-pointer "+(activeImageIndex == index && "border-[5px]")} 
                                onClick={
                                    ()=>{
                                        setActiveImageIndex(index);
                                    }
                                }/>
                            )
                        }
                    )
                }
            </div>
        </div>
    )
}