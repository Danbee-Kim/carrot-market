import React, { useEffect, useState } from "react";
import styled from "styled-components";
import back from "../img/back.png";
import { MdOutlineArrowBackIos, MdAddAPhoto, MdOutlinePostAdd, MdOutlineTune } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const Form = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  //유저가 수정버튼을 클릭했을 경우..~
  const { mode, id } = useSelector((state) => state.detail.changeMode);
  console.log(mode, id);

  //---------------------------------->
  const [region, setRegiont] = useState();
  const [category, setCategory] = useState();
  //사진업로드
  const [files, setFiles] = useState([]);
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
    maxFiles: 5,
    maxSize: 100000000, //100메가
    accept: {
      "image/jpeg": [],
      "image/png": [], // 두가지 형식만 가능
    },
    onDrop: (acceptedFiles) => {
      console.log(files.length);
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  console.log(acceptedFiles);
  console.log(files);

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <div key={file.path}>
      {errors.map((e) => {
        console.log(errors);
        return (
          <div style={{ marginLeft: "10px" }} key={e.code}>
            {e.code}
          </div>
        );
      })}
    </div>
  ));

  const thumbs = files.map((file) => (
    <Thumb key={file.name}>
      <Img
        src={file.preview}
        // Revoke data uri after image is loaded
        onLoad={() => {
          URL.revokeObjectURL(file.preview);
        }}
      />
    </Thumb>
  ));
  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  const onClickSubmit = async () => {
    // e.persist(); 찾아보기..이게뭐지?
    let formData = new FormData();
    for (var i = 0; i < acceptedFiles.length; i++) {
      let file = acceptedFiles[i];
      formData.append("imageFiles[]", file);
    }
    let dataSet = {
      title: title,
      region: region,
      category: category,
      price: price,
      content: content,
    };
    formData.append("textData", JSON.stringify(dataSet));
    try {
      await axios({
        method: "post",
        url: `${API_URL}/article/auth`,
        headers: {
          "Content-Type": "multipart/form-data", // Content-Type을 반드시 이렇게 하여야 한다.
          // Authorization: token,
        },
        data: formData,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  //수정
  const onClickChangeSubmit = async () => {
    let formData = new FormData();
    for (var i = 0; i < acceptedFiles.length; i++) {
      let file = acceptedFiles[i];
      formData.append("imageFiles[]", file);
    }
    let dataSet = {
      title: title,
      region: region,
      category: category,
      price: price,
      content: content,
    };
    formData.append("data", JSON.stringify(dataSet));
    try {
      await axios({
        method: "patch",
        url: `${API_URL}/article/auth/${id}`,
        headers: {
          "Content-Type": "multipart/form-data", // Content-Type을 반드시 이렇게 하여야 한다.
        },
        data: formData,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  //----------------------------------------------->

  const { form } = useSelector((state) => state);

  console.log(price, region, category, title, content);

  const onChangeTitleHandler = (e) => {
    setTitle(e.currentTarget.value);
  };
  const onChangeContentHandler = (e) => {
    setContent(e.currentTarget.value);
  };

  const onChangeRegionHandler = (e) => {
    setRegiont(e.currentTarget.value);
  };

  const onChangeCategoryHandler = (e) => {
    setCategory(e.currentTarget.value);
  };

  const RegionOptions = [
    { key: 1, value: "지역을 선택하세요" },
    { key: 2, value: "서울특별시" },
    { key: 3, value: "부산광역시" },
    { key: 4, value: "인천광역시" },
    { key: 5, value: "경기도" },
    { key: 6, value: "강원도" },
    { key: 7, value: "충청북도" },
    { key: 8, value: "충청남도" },
    { key: 9, value: "전라북도" },
    { key: 10, value: "전라남도" },
    { key: 11, value: "경상북도" },
    { key: 12, value: "경상남도" },
    { key: 13, value: "제주특별자치도" },
  ];

  const onChanePrice = (e) => {
    setPrice(e.target.value);
  };

  const CategoryOptions = [
    { key: 1, value: "카테고리를 선택하세요" },
    { key: 2, value: "생활가전" },
    { key: 3, value: "생활용품" },
    { key: 4, value: "의류" },
    { key: 5, value: "잡화" },
    { key: 6, value: "디지털기기" },
  ];

  return (
    <>
      <ViewItemWrap>
        <FirstWrap>
          <Title>
            <BackButton
              onClick={() => {
                navigate("/");
              }}
            >
              <MdOutlineArrowBackIos size="25" />
            </BackButton>
          </Title>
          {/* <AddPhotoButton> */}
          {/* 이미지 업로드 */}
          <Container>
            <input {...getInputProps()} />
            <StButton {...getRootProps()}>
              <MdAddAPhoto size="30px" />
              <Length>{files.length}/5</Length>
            </StButton>
            <ThumbsContainer>{thumbs}</ThumbsContainer>
            <div>{fileRejectionItems}</div>
          </Container>
          {/* <AddPhtoPreviews /> */}
          {/* </AddPhotoButton> */}
          <div>
            <ItemImg back={back}></ItemImg>
          </div>
          <Input onChange={onChangeTitleHandler} value={title} placeholder="제목을 입력하세요"></Input>
          {/* select box */}
          <SelectBox>
            <StSelect onChange={onChangeRegionHandler} value={region}>
              {RegionOptions.map((item, index) => (
                <option key={item.key} value={item.value}>
                  {item.value}
                </option>
              ))}
            </StSelect>
            <StSelect onChange={onChangeCategoryHandler} value={category}>
              {CategoryOptions.map((item, index) => (
                <option key={item.key} value={item.value}>
                  {item.value}
                </option>
              ))}
            </StSelect>
          </SelectBox>
          <PriceWrap>
            <PriceInput value={price} type="number" onChange={onChanePrice} placeholder="₩ 가격(선택사항)" placeholderTextColor="green"></PriceInput>
            <StPriceView>{price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</StPriceView>
          </PriceWrap>
          <Textarea
            onChange={onChangeContentHandler}
            value={content}
            cols="50"
            rows="8"
            maxLength="200"
            placeholder="게시글 내용을 작성해주세요. 가품 및 판매금지품목은 게시가 제한될 수 있습니다."
          />
          <BottomTextWrap>
            <MdOutlinePostAdd />
            <BottomText>자주 쓰는 문구 </BottomText>
            <MdOutlineTune />
            <BottomText>보여줄 동네 설정</BottomText>
          </BottomTextWrap>
          {mode ? <AddButton onClick={onClickChangeSubmit}>수정 완료</AddButton> : <AddButton onClick={onClickSubmit}>완료</AddButton>}
        </FirstWrap>
      </ViewItemWrap>
    </>
  );
};

export default Form;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #e9ecef;
`;

const BackButton = styled.div`
  margin: 8px 10px 0 0;
  cursor: pointer;
`;

const Input = styled.input`
  font-size: 15px;
  outline: none;
  padding: 30px 15px;
  width: 100%;
  height: 35px;
  border: 1px solid transparent;
  border-bottom: 1px solid #e9ecef;
`;
const Textarea = styled.textarea`
  font-size: 15px;
  outline: none;
  padding: 30px 15px;
  width: 100%;
  border: 1px solid transparent;
  border-bottom: 1px solid #e9ecef;
`;

const PriceWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 30px 15px;
  width: 100%;
  height: 35px;
  border: 1px solid transparent;
  border-bottom: 1px solid #e9ecef;
`;
const PriceInput = styled.input`
  font-size: 15px;
  outline: none;
  padding-left: 2px;
  width: 50%;
  height: 35px;
  border: none;
`;

const StPriceView = styled.div`
  font-size: 18px;
  font-weight: bold;
  text-align: right;
  width: 50%;
`;

const SelectBox = styled.div`
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #e9ecef;
`;

const StSelect = styled.select`
  margin: 5px 0;
  color: #696969;
  font-size: 15px;
  border: 1px solid #e9e9e9;
  padding: 10px;
  width: 100%;
  height: 43px;
  border-radius: 5px;
  :focus {
    outline: none;
  }
`;

const ViewItemWrap = styled.div`
  width: 100%;
`;

//Item Image
const FirstWrap = styled.div`
  height: 500px;
`;
const ItemImg = styled.div`
  background-image: url(${(props) => props.back});
  background-size: cover;
  background-position: center;
  display: inline-block;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  border-radius: 10px;
`;
//---------------------------------------->
//content
const BottomTextWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  border-bottom: 1px solid #e9ecef;
`;
const BottomText = styled.div`
  margin: 15px 10px 15px 5px;
  font-size: 16px;
  font-weight: bold;
`;

const AddButton = styled.div`
  text-align: center;
  cursor: pointer;
  margin: 20px auto;
  padding-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #ff8a3d;
`;

//사진 업로드

const ThumbsContainer = styled.aside`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Container = styled.section`
  align-items: center;
  display: flex;
  flex-direction: row;
`;

const Length = styled.span`
  font-size: 12px;
  position: absolute;
  bottom: 10px;
  left: 31px;
`;

const Thumb = styled.div`
  display: inline-flex;
  width: 80px;
  height: 80px;
  padding: 4px;
  box-sizing: border-box;
`;

const Img = styled.img`
  border-radius: 12px;
  display: block;
  width: auto;
  height: 100%;
  margin-left: 5px;
`;

const StButton = styled.div`
  cursor: pointer;
  :hover {
    border: 1px solid #999999;
  }
  width: 80px;
  height: 80px;
  background-color: #f1f1f1;
  border: 1px solid #cccccc;
  border-radius: 10px;
  padding: 18px 23px;
  position: relative;
`;
