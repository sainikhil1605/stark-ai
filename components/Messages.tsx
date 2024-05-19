import { useVoice } from "@humeai/voice-react";
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'



export default function Controls() {
  const { messages } = useVoice();
  // console.log(messages)


  return (
    <div className="w-full bg-white flex flex-col overflow-scroll">
      {messages.map((msg, index) => {
        if (msg.type === "user_message" || msg.type === "assistant_message") {
          return (
            <div className={`max-w-44 my-2 mx-1 ${msg.type === "user_message" ? "self-end" : "self-top"}`} key={msg.type + index}>
              <div className="bg-gray-300 rounded-lg p-2">{msg.message.content}</div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}