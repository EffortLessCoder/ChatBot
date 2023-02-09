import { useState, useRef } from 'react'
import './App.css'
import { Mic, RocketOutline } from 'react-ionicons'
import { useEffect } from 'react'

function App() {
  const [Req, setReq] = useState("")
  const [Messages, setMessages] = useState([])
  const [Response, setResponse] = useState([])
  const [fetching, setfetch] = useState(false)
  const containerRef = useRef(null)

  function sent_req() {
    fetch("http://127.0.0.1:5000/req", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: `${Req}` })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
      })
    setMessages([...Messages, Req])
    setReq("")
  }
  function SetValue(e) {
    setReq(e.target.value)
  }
  function submit_input(event) {
    if (event.key === "Enter" && event.target.value != "") {
      sent_req()
    }
  }
  function normal_submit() {
    sent_req()
  }
  const fetchRes = async () => {
    setfetch(true)
    const response = await fetch("http://127.0.0.1:5000/res");
    const data = await response.json()
    const message = {id : Date.now(),text:data['data']}
    setResponse(prevResponse => [...prevResponse, message]);
    setResid(data.id);
    setfetch(false)
  }
  // useEffect(() => {
  //   if (!fetching) {
  //     setTimeout(fetchRes, 5000);
  //   }
  // }, [fetching])
  return (
    <div className="container flex flex-row justify-between items-center mx-16">
      <div className="header w-96 flex flex-col justify-center items-center my-4 mx-3">
        <h1 className='text-4xl font-semibold'>CHAT BOT</h1>
        <span className='text-md font-thin my-2 text-center'>I am an ChatBot created to Chat with random details I accquired</span>
      </div>
      <div className="chat_box flex flex-row justify-between items-center my-3">
        <div className="outer_options w-3/4 h-20 m-5 flex flex-row justify-around items-center border border-slate-300 relative top-56">
          <input className='w-3/4 h-2/4 placeholder:italic placeholder:text-slate-400 block bg-white border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm' placeholder="Search for anything..." type="text" name="query" value={Req} onChange={SetValue} onKeyPress={submit_input} />
          <RocketOutline color={'#333'} height="25px" width="25px" onClick={normal_submit} style={{ cursor: 'pointer' }} /><Mic color={'#333'} height="25px" width="25px" style={{ cursor: 'pointer' }} />
        </div>
        <div ref={containerRef} className="overflow-scroll inner_text_box border-2 border-red-400 rounded-lg flex flex-col justify-start p-5 pb-5">
          {Messages.map((message, index) => (
            <div key={index} className='self-end my-2'><span key={index} className='text-right w-1/3 break-normal shadow-inner border-2 border-double border-stone-300 bg-gray-100 px-10 my-3 rounded-md'>{message}</span></div>
          ))}
          {
            Response.map(res=>(
              <div key={res.id}>{res.text}</div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default App


//<span className='text w-max shadow-inner border-2 border-double border-stone-300 bg-gray-100 px-10 my-3 rounded-md'>hi</span>