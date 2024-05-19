import { useVoice, VoiceReadyState } from "@humeai/voice-react";
import { useEffect, useRef, useState } from "react";

import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'
export default function Controls() {
  const { connect, disconnect, readyState, sendUserInput, micFft } = useVoice();
  const [message, setMessage] = useState<string>("");
  let micSelect;
  let wavesurfer, record
  let scrollingWaveform = false
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);



  const showWaveform = () => {
    if (wavesurfer) {
      wavesurfer.destroy()
    }
    wavesurfer = WaveSurfer.create({
      container: '#mic',
      waveColor: 'rgb(200, 0, 200)',
      progressColor: 'rgb(100, 0, 100)',
      renderFunction: (channels, ctx) => {
        const { width, height } = ctx.canvas
        const scale = channels[0].length / width
        const step = 10

        ctx.translate(0, height / 2)
        ctx.strokeStyle = ctx.fillStyle
        ctx.beginPath()

        for (let i = 0; i < width; i += step * 2) {
          const index = Math.floor(i * scale)
          const value = Math.abs(channels[0][index])
          let x = i
          let y = value * height

          ctx.moveTo(x, 0)
          ctx.lineTo(x, y)
          ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, true)
          ctx.lineTo(x + step, 0)

          x = x + step
          y = -y
          ctx.moveTo(x, 0)
          ctx.lineTo(x, y)
          ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, false)
          ctx.lineTo(x + step, 0)
        }

        ctx.stroke()
        ctx.closePath()
      },
    })

    record = wavesurfer.registerPlugin(RecordPlugin.create({ scrollingWaveform, renderRecordedAudio: false }))

    RecordPlugin.getAvailableAudioDevices().then((devices) => {
      console.log(devices)
      micSelect = devices[0].deviceId
    })
    const deviceId = "default"
    record.startRecording({ deviceId }).then(() => {
      console.log('Waveform started')
    })
  }

  if (readyState === VoiceReadyState.OPEN) {
    return (
      <div className="w-full  flex justify-center align-bottom absolute bottom-0">

        <div ref={waveformRef} />
        <input
          className="w-full bg-white"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendUserInput(message);
              setMessage("");
            }
          }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-3"

          onClick={() => {
            disconnect();
          }}
        >
          End Session
        </button></div>

    );
  }

  return (
    <div className="w-full mt-10 p-4  flex justify-center align-bottom absolute bottom-0 flex-col">

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-3"
        onClick={() => {
          showWaveform();

          connect()
            .then(() => {
              //   /* handle success */
            })
            .catch(() => {
              //   /* handle error */
            });
        }}
      >
        Start Session
      </button>
    </div>


  );
}