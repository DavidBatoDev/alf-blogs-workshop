import React, { useEffect, useState } from "react";
import { redirect, useLoaderData } from "react-router-dom";
import "../styles/ArticleSection.css";
import Blur from "./Blur";
import Button from "./Button";
import CardsContainer from "./CardsContainer";
import FormModal from "./FormModal";
import RegularCard from "./RegularCard";
import Searchbar from "./Searchbar";
import { API_URL } from "../constants";

export const articlesLoader = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const articleCreateAction = async ({ request }) => {
  const formData = await request.formData();
  const newFormData = new FormData();
  newFormData.append("title", formData.get("title"));
  newFormData.append("author", formData.get("author"));
  newFormData.append("cover_photo", formData.get("cover_photo"));
  newFormData.append("content", localStorage.getItem("content"));

  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    body: newFormData,
  });

  if (!response.ok) throw response;
  const data = await response.json();
  return redirect(`/article/${data._id}`);
};

const ArticleSection = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const cards = useLoaderData();

  const isCardMatch = (val, card) => {
    const titleMatch = card.title.toLowerCase().includes(val.toLowerCase().trim());
    return (val.length != 0 && titleMatch) || val.length == 0;
  };

  const handleCardSearch = (value) => {
    const cardsMatched = [];

    setSearchText(value);
    cards.forEach((card) => {
      if (isCardMatch(value, card)) {
        cardsMatched.push(<RegularCard key={card._id} {...card} />);
      }
    });

    setSearchResult(cardsMatched);
  };

  useEffect(() => {
    handleCardSearch(searchText);
  }, []);

  return (
    <div id="articleSection">
      <Blur
        h={"60%"}
        w={"45%"}
        bg={"#7000FF"}
        x={"0"}
        y={"25%"}
        opacity={0.15}
        blur={"400px"}
        translate_x={"-50%"}
        translate_y={"-50%"}
        border_radius={"100%"}
      />
      <Blur
        h={"50%"}
        w={"35%"}
        bg={"#60FFE7"}
        x={"80%"}
        y={"80%"}
        opacity={0.15}
        blur={"400px"}
        translate_x={"-50%"}
        translate_y={"-50%"}
        border_radius={"100%"}
      />

      <div className="article-sec-heading-container">
        <p className="article-sec-heading">Learn About Everything Tech!</p>
        <p className="article-sec-subheading">brought to you by AWSCC Department of Software and Web Development</p>
      </div>

      {cards.length > 0 && (
        <div className="article-top-container">
          <FormModal>
            {(toggleModal) => (
              <Button variant="primary" onClick={toggleModal}>
                Create Article
              </Button>
            )}
          </FormModal>
          <Searchbar searchText={searchText} onSearchChange={handleCardSearch} />
        </div>
      )}

      <CardsContainer isEmpty={cards.length === 0} filterResult={searchResult} searchText={searchText} />
    </div>
  );
};

export default ArticleSection;