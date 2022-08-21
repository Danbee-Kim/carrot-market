import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import chatting from "../img/chatting.png";
import { BiSmile } from "react-icons/bi";
import { BsPlusLg } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { __postComments } from "../redux/modules/commentsSlice";
import { useState } from "react";

const ConmmentInput = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const onChangeHandler = (e) => {
    setInput(e.target.value);
  };
  const onClickHandler = () => {
    dispatch(__postComments({ content: input }));
    setInput("")
  };

  return (
    <CommentWrap>
      <InputWrap>
        <BsPlusLg style={{ marginRight: "10px" }} size="30" color="#c4c4c4eb" />
        <Input value={input} type="text" onChange={onChangeHandler} />
        {/* <BiSmile size="35" color="#d6d6d6eb" /> */}
        <ButtonImg onClick={onClickHandler} chatting={chatting} />
      </InputWrap>
    </CommentWrap>
  );
};

export default ConmmentInput;

const Input = styled.input`
  padding: 15px;
  margin-right: 1px;
  width: 100%;
  height: 35px;
  border: 1px solid #d6d6d6eb;
  border-radius: 25px;
  outline: 1px solid #d6d6d6eb;
  :focus {
    border: 1px solid transparent;
  }
`;

const CommentWrap = styled.div`
  width: 100%;
  margin: auto;
`;

const ButtonImg = styled.div`
  cursor: pointer;
  background-image: url(${(props) => props.chatting});
  display: inline-block;
  width: 50px;
  height: 50px;
  background-size: 50px;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0;
  overflow: hidden;
`;

const InputWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
