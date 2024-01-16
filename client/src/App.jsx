import { useEffect, useMemo, useState } from 'react'
import {io} from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const App = () => {

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketID] = useState("");
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);

  const socket = useMemo(() => io("http://localhost:5000"), []);

  // socket in client side shows the individual id for the user

  useEffect(() => {

    socket.on("connect", () => {  // "connect" is a pre-built event
      setSocketID(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("welcome", (msg) => console.log(msg));

    socket.on("broadcast", (msg) => {
      console.log(msg);
    })

    socket.on("recieve-message", (data) => {
      console.log(data);
    })

    socket.on("single-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data])
    })


    return () => {   // The separate return function is known as the "cleanup function" or "cleanup phase." It is executed when the component unmounts or when the dependencies specified in the dependency array ([] in your case) change. meaning the effect runs only once when the component mounts, and the cleanup function is called when the component unmounts.
      socket.disconnect();
    }

  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", {message, room});
    setMessage("")
  }

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };


  return (
<Container maxWidth="sm">
      <Box sx={{ height: 500 }} />
      <Typography variant="h6" component="div" gutterBottom>
        {socketID}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />

        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

    <Stack>
      {messages.map((m, i) => (
        <Typography key={i} variant="h6" component="div" gutterBottom>
          {m.message}
        </Typography>
      ))}
    </Stack>

    </Container>
  )
}

export default App