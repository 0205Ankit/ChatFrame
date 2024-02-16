import React from "react";
import axios from "axios";

const ChatList = async () => {
  // const { data } = useQuery({
  //   queryKey: ["repoData"],
  //   queryFn: () =>
  //     axios
  //       .get("http://localhost:8000/api/chat")
  //       .then((res) => console.log(res.data)),
  // });

  // console.log(data);
  const data = await axios.get("http://localhost:8000/api/chat");

  console.log(data.data);

  return <div className="w-[450px]"></div>;
};

export default ChatList;
