"use client";
import { useState, useRef, MutableRefObject, FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [messagesList, setMessagesList] = useState([
    {
      role: "system",
      content:
        "you are the rizz lord. you respond with one line rizz statement",
      id: uuidv4(),
    },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;

  const emptyInput = () => {
    inputRef.current.value = "";
  };

  const formBehavior = (e: FormEvent) => {
    e.preventDefault();
    if (userMessage.trim() === "") {
      return;
    }
    sendRequest();
  };

  const sendRequest = async () => {
    try {
      emptyInput();
      setMessagesList((messageList) => [
        ...messageList,
        { role: "user", content: userMessage, id: uuidv4() },
      ]);
      console.log(messagesList);
      const data = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [...messagesList, { role: "user", content: userMessage }],
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
      const { response, id } = await data.json();
      console.log(response);
      setMessagesList((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: response, id },
      ]);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="max-w-[800px] mx-auto px-4 box-border h-[100vh] overflow-hidden ">
      <h1 className="text-center mb-8 mt-3 text-[22px] font-semibold">Chat</h1>
      <div className="overscroll-none h-[80%] w-full">
        <ul className="mb-6 flex flex-col overflow-hidden overflow-y-scroll h-[95%] w-full">
          {messagesList.map((arr) =>
            arr.role !== "system" ? (
              <li
                key={arr.id}
                className={
                  arr.role === "user"
                    ? "self-start  bg-[#b2f2bb] chat"
                    : "self-end  bg-[#fff3bf] chat"
                }
              >
                {arr.content}
              </li>
            ) : (
              ""
            )
          )}
        </ul>
      </div>
      <form className="flex gap-2 mb-10" onSubmit={formBehavior}>
        <input
          ref={inputRef}
          type="text"
          placeholder="enter text.."
          onChange={(e) => setUserMessage(e.target.value)}
          className="border-2 border-solid border-black rounded-md w-[90%] px-2"
        />
        <button
          type="submit"
          className="bg-black text-white px-2 py-1 rounded-md border-0 hover:text-blue-200 w-[10%] h-10 text-md flex items-center justify-center"
        >
          Send
        </button>
      </form>
    </div>
  );
}
