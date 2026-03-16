import { useState } from 'react'

function App() {

  const [notes, setNotes] = useState("")
  const [tasks, setTasks] = useState([])
  const [heading, setHeading] = useState("")

  function submitForm() {

    let card = [...tasks]

    card.push({
      Title: heading,
      Topics: notes
    })

    setTasks(card)

    setNotes("")
    setHeading("")
    console.log(tasks)
  }

  return (
    <>
      <section className='md:flex items-center justify-center'>

        {/* Add Task */}
        <div className='md:w-1/2 bg-indigo-100 h-screen'>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submitForm()
            }}
            className='h-[100vh] flex justify-center items-center flex-col gap-5'
          >

            <h2 className='font-bold text-3xl'>Create a Note</h2>

            <input
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              type="text"
              className='font-bold bg-white border w-90 border-emerald-700 px-4 py-2 outline-none text-emerald-700 rounded-md block'
              placeholder='Heading'
            />

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder='Topics...'
              className='bg-white w-90 border border-emerald-700 px-6 py-2 outline-none text-emerald-700 rounded-md block'
            ></textarea>

            <input
              type="submit"
              value="Submit"
              className='px-39 py-2 bg-cyan-300 rounded-sm'
            />

          </form>
        </div>

        {/* create notes */}
        <div className="md:w-1/2 bg-emerald-100 min-h-screen border-l-2 border-white p-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {tasks.map((task, index) => {
              return (
                <div
                  key={index}
                  className="w-full h-60 bg-white rounded-2xl p-4 shadow-xl relative flex flex-col"
                >
                  <img
                    src="https://pngimg.com/d/pin_PNG76.png"
                    alt=""
                    className="h-10 absolute -top-4 left-1/2 -translate-x-1/2"
                  />

                  <div className="bg-yellow-400 rounded-xl p-4 h-full mt-4 overflow-hidden">
                    <p className="text-xl font-semibold">{task.Title}</p>
                    <p className="text-sm mt-2 break-words">{task.Topics}</p>
                  </div>
                </div>
              )
            })}

          </div>

        </div>
      </section>
    </>
  )
}

export default App