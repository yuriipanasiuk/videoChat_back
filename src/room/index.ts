import { Socket } from "socket.io";
import { v4 } from "uuid";

type TRoom = (socket: Socket) => void;

export const roomHandler: TRoom = (socket) => {
  const createRoom = () => {
    const roomId = v4();

    socket.emit("room-created", { roomId });
    console.log("user created the room");
  };

  const joinRoom = ({ roomId }: { roomId: string }) => {
    console.log("user joined the room", roomId);
    socket.join(roomId);
  };

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
};
