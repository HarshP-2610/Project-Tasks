import React, { useState } from 'react'

const AddUser = () => {

    const [data, setData] = useState([
        { name: "Aarav Patel", email: "aarav9669@gmail.com" },
        { name: "Riya Sharma", email: "riya143@gmail.com" },
        { name: "Vivian Mehta", email: "vivian67@gmail.com" },
    ])

    function Add() {
        let arr = [...data]

        arr.push({ name: "Ananya Gupta", email: "ananya123@gmail.com" })
        if (data[3]?.name === "Ananya Gupta") {
            return;
        }
        setData(arr)
    }

    function AddTwo() {
        let arr = [...data]

        arr.push({ name: "Vaibhav Pandit", email: "vaibhav456@gmail.com" }, { name: "Raghav Shrivastav", email: "raghav789@gmail.com" })
        if (data[4]?.name === "Vaibhav Pandit" && data[5]?.name === "Raghav Shrivastav") {
            return;
        }
        setData(arr)
    }


    return (
        <>
            <section className='flex flex-wrap gap-6 mt-5 justify-center items-center'>
                {/*  */}

                {data.map((user) => {
                    return (
                        <div className='bg-black/60 rounded-xl w-full h-auto max-w-sm p-2 text-center font-bold text-2xl flex flex-col gap-2'>
                            <h1 className='bg-black/30 px-4 py-2 text-white rounded-xl'>{user.name}</h1>
                            <h1 className='bg-black/30 px-4 py-2 text-white rounded-xl'>{user.email}</h1>
                        </div>
                    )
                })}
            </section>
            <div className='flex justify-center mt-5 mb-5 gap-10'>
                <button onClick={Add} className="bg-emerald-600 py-3 active:bg-emerald-700 cursor-pointer px-10 text-center rounded-md text-white font-bold">Add User</button>
                <button onClick={AddTwo} className="bg-emerald-600 py-3 active:bg-emerald-700 cursor-pointer px-10 text-center rounded-md text-white font-bold">Add 2 User</button>
            </div>

        </>
    )
}

export default AddUser;


