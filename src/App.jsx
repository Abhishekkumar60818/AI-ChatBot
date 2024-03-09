import { useState } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { FaSpinner } from "react-icons/fa"; // Import spinner component

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  async function generateAnswer() {
    setGeneratingAnswer(true);
    setAnswer(""); // Clear answer before loading

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBwRJ-crKN8cyEXD_6Tj36dF9dxJcclZRc",
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      setAnswer(
        response["data"]["candidates"][0]["content"]["parts"][0]["text"]
      );
    } catch (error) {
      setAnswer("Sorry - Something went wrong. Please try again!");
    }

    setGeneratingAnswer(false);
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      generateAnswer();
    }
  }

  return (
    <>
      <div className="bg-white h-screen p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission
            generateAnswer();
          }}
          className="w-full md:w-2/3 m-auto text-center rounded bg-gray-50 py-2"
        >
          <h1 className="text-3xl text-center">ChatBot</h1>
          <p className="text-xs">Using Google Gemini API</p>
         
          <textarea
            required
            className="border rounded w-11/12 my-2 min-h-fit p-3"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything"
            onKeyPress={handleKeyPress} // Call handleKeyPress function on key press
          ></textarea>
          <button
            type="submit"
            className="bg-blue-300 p-3 rounded-md hover:bg-blue-400 transition-all duration-300"
            disabled={generatingAnswer}
          >
            {generatingAnswer ? ( // Display spinner when generating answer
              <FaSpinner className="animate-spin" />
            ) : (
              "Generate answer"
            )}
          </button>
        </form>
        <div className="w-full md:w-2/3 m-auto text-center rounded bg-gray-50 my-1">
          <ReactMarkdown className="p-3">{answer}</ReactMarkdown>
        </div>
      </div>
    </>
  );
}

export default App;
