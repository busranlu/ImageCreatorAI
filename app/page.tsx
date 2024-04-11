"use client";
import { useState } from "react";
import { useChat } from "ai/react";

export default function Chat() {
  const {
     messages,
     input,
     handleInputChange,
     handleSubmit,
     append,
     isLoading 
    } = useChat();

  const Themes = [
    { value: "Anime" },
    { value: "Photographic" },
    { value: "Pixel Art" },
    { value: "Cinematic" },
    { value: "Digital Art" },
    { value: "Comic Book" },
  ];

  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [theme, setTheme] = useState(Themes[0]);

  if (imageIsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-700 h-10 w-10"></div>
          </div>
        </div>
      </div>
   );
  }

  if (image) {
    return (
      <div className="card w-full h-screen max-w-md py-24 mx-auto stretch">
        <img src={`data:image/jpeg;base64,${image}`} />
        <textarea
          className="mt-4 w-full text-white bg-black h-64"
          value={messages[messages.length - 1].content}
          readOnly
        />
      </div>
    );
  }

  const [state, setState] = useState({
    themes: "",
  }); 

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };


  <form onSubmit={handleSubmit} className="flex justify-center">
     <input
       className="w-[95%] p-2 mb-8 border border-gray-300 rounded shadow-xl text-black"
       disabled={isLoading}
       value={input}
       placeholder="Say something..."
       onChange={handleInputChange}
     />
  </form>


  return (
    <main className="mx-auto w-full p-24 flex flex-col">
      <div className="p4 m-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-white">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">
              Image Creater App
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Customize the image by selecting the theme.
            </p>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">
              Themes
            </h3>

            <div className="flex flex-wrap justify-center">
              {Themes.map(({ value}) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    value={value}
                    name="theme"
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={isLoading || (!state.themes)}
            onClick={() =>
              append({
                role: "user",
                content: `Generate a ${state.themes} painting description`,
              })
            }
          >
            Generate painting description
          </button>













          {isLoading && (
          <div className="flex justify-end pr-4">
            <span className="animate-bounce">...</span>
          </div>
          )}

          {messages.length == 2 && !isLoading && (
            <button
              className="bg-blue-500 p-2 text-white rounded shadow-xl"
              disabled={isLoading}
              onClick={async () => {
                setImageIsLoading(true);
                const response = await fetch("api/images", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    message: messages[messages.length - 1].content,
                  }),
                });
                const data = await response.json();
                setImage(data);
                setImageIsLoading(false);
              }}
            >
              Generate image
            </button>
          )}


          <div className="mt-auto w-2/5 mx-auto">
          
          
          
        
      </div>


        </div>
      </div>
    </main>
  );

}
