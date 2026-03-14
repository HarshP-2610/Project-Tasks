
import { useState } from "react";

function counter() {
    const [number, setNumber] = useState(0);

    return (
        <>
            <div className="h-screen flex flex-col justify-center items-center gap-5">
                <div>
                    <h2 className="text-center text-red-800 text-7xl">{number}</h2>
                </div>
                <div className="flex gap-5">
                    <button
                        className="w-30 h-10 bg-blue-500 rounded-sm"
                        onClick={() => setNumber((count) => count + 1)}
                    >
                        Increment
                    </button>
                    <button
                        className="w-30 h-10 bg-red-500 rounded-sm"
                        onClick={() => setNumber((count) => count - 1)}
                    >
                        Decrement
                    </button>
                    <button
                        className="w-30 h-10 bg-cyan-400 rounded-sm"
                        onClick={() => setNumber((count) => (count = 0))}
                    >
                        Reset
                    </button>

                    {/* Jump 5 and decrease by 5 */}
                    <button
                        className="w-30 h-10 bg-emerald-400 rounded-sm"
                        onClick={() => setNumber((count) => (count + 5))}
                    >
                        Jump By 5
                    </button>
                    <button
                        className="w-30 h-10 bg-amber-400 rounded-sm"
                        onClick={() => setNumber((count) => (count - 5))}
                    >
                        Decrease By 5
                    </button>
                </div>
            </div>
        </>
    );
}

export default counter;



