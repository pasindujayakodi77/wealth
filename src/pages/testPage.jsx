import { useState } from "react";


export default function TestPage(){
    //let count = 0;
    const [count , setCount] = useState(0)
    //const [name, setName] = useState("Malith")


    function increment(){
        setCount(prev => prev + 1);
    }

    function decrement(){
        setCount(prev => prev - 1);
    }
    

    return(
        <div className="w-full h-screen bg-amber-200 flex justify-center items-center">
            <div className="w-100 h-100 bg-white flex flex-col justify-center items-center">

                <h1 className="text-5xl font-bold">{count}</h1>

                <div className="w-full flex justify-center items-center  h-25">
                    <button onClick={decrement} className="w-25 bg-blue-500 h-11.25 text-3xl mx-2 flex justify-center items-center text-white rounded-full">
                        -
                    </button>

                    <button onClick={increment} className="w-25 bg-blue-500 h-11.25 text-3xl mx-2 flex justify-center items-center text-white rounded-full">
                        +
                    </button>
                </div>
            </div>
        </div>
    ) 
}