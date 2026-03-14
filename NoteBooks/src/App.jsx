import { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    topics: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    // Add your logic here
  };

  return (
    <>
      <section className='flex items-center justify-center h-screen bg-gray-50'>
        {/* Form Container */}
        <div className='w-1/2 bg-red-100 h-screen flex flex-col items-center justify-center p-10'>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Entry</h2>

          <form onSubmit={handleSubmit} className='w-full max-w-md flex flex-col gap-4'>
            {/* 1. Textbox: Topics */}
            <input
              type="text"
              placeholder='Topics....'
              className='w-full h-12 px-4 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none'
              value={formData.topics}
              onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
            />

            {/* 2. Textarea: Description */}
            <textarea
              placeholder='Description....'
              className='w-full h-32 p-4 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none resize-none'
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>

            {/* 3. Submit: Create Button */}
            <button
              type="submit"
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors'
            >
              Create
            </button>
          </form>
        </div>

        {/* Right Side Preview/Empty Space */}
        <div className='w-1/2 bg-green-100 h-screen border-l-2 border-white flex items-center justify-center'>
          <p className="text-gray-500 italic">Preview or content will appear here.</p>
        </div>
      </section>
    </>
  );
}

export default App;