


import { useState } from "react";
// import Counter from "./Component/counter";

const changeUser = () => {
    // const [number, setNumber] = useState(0);

    return (
        <>
            <section className="flex justify-center items-center h-[100vh]">
                <div className="w-fit h-auto max-w-sm p-2 rounded-2xl bg-indigo-300">
                    {/* photo */}
                    <div className="flex flex-col relative rounded-2xl p-4 w-60 h-96 bg-center bg-cover bg-[url('https://i.pinimg.com/1200x/0b/f4/33/0bf433aef9b003bb94ab58ab90e90b07.jpg')] ">
                        <div className="h-1/2"></div>
                        {/* <div className="bg-opacity-30 backdrop-blur-lg rounded-lg shadow-lg "> */}
                        <div className="flex flex-col gap-1 p-2 bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-lg absolute bottom-0 left-0 w-full h-35 bg-gradient-to-t from-transparent from-black/60  ">

                            <div className="flex items-center gap-1">
                                <h1 className="text-xl font-bold text-amber-300">John Doe</h1>
                                <img src="./assets/tick.png" alt="" className="h-5" />
                            </div>

                            <div>
                                <p className="text-xs text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, enim!</p>
                            </div>

                            <div className="mt-3">
                                <div>

                                </div>
                                <div></div>
                                <div><button className="w-25 h-9 bg-white rounded-full">Follow +</button></div>
                            </div>
                        </div>
                    </div>
                    {/* content */}
                </div>

            </section>

        </>
    );
}

export default changeUser;
