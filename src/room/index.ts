import { Socket } from "socket.io";
import { v4 } from "uuid";

type TRoom = (socket: Socket) => void;
interface IRoomParams {
  roomId: string;
  peerId: string;
}

const rooms: Record<string, string[]> = {};

export const roomHandler: TRoom = (socket) => {
  const createRoom = () => {
    const roomId = v4();
    rooms[roomId] = [];
    socket.emit("room-created", { roomId });

    console.log("user created the room");
  };

  const joinRoom = ({ roomId, peerId }: IRoomParams) => {
    if (rooms[roomId]) {
      console.log("user joined the room", roomId, peerId);
      rooms[roomId].push(peerId);

      socket.join(roomId);
      socket.to(roomId).emit("user-joined", { peerId });
      socket.emit("get-users", {
        roomId,
        participants: rooms[roomId],
      });
    }

    socket.on("disconnect", () => {
      console.log(`user left the room ${peerId}`);
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ roomId, peerId }: IRoomParams) => {
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
    }
    socket.to(roomId).emit("user-disconnected", peerId);
  };

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
};
