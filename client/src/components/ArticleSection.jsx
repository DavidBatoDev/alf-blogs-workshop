import { useEffect, useState } from "react";
import "../styles/ArticleSection.css"
import Button from "./Button";
import CardsContainer from "./CardsContainer";
import Searchbar from "./Searchbar";
import RegularCard from "./RegularCard";
import { API_URL } from "../constants";
import Blur from "./Blur";

const mockData = [
  {_id: 1, title: "AASHIDOASIODASHO ASDSA", date: Date.now(), cover_photo: "/preview.png", content: "dasdasd"},
  {_id: 2, title: "F DSGSDDSF", date: Date.now(), cover_photo: "/preview.png", content: "Conasdsafdastent"},
  {_id: 3, title: "EFEDFG DGFD GFD", date: Date.now(), cover_photo: "/preview.png", content: "Consdfdsfsdtent"},
  {_id: 4, title: "SFSDGG FGFGF", date: Date.now(), cover_photo: "/preview.png", content: "sdfsdf"},
  {_id: 5, title: "SDFGDSG FSDH FDH", date: Date.now(), cover_photo: "/preview.png", content: "fsdsdfsd"},
];

const ArticleSection = () => {

  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [cards, setCards] = useState(mockData);

  const isCardMatch = (val, card) => {
    const titleMatch = card.title.toLowerCase().includes(val.toLowerCase().trim());
    return (val.length != 0 && titleMatch) || val.length == 0;
  };

  const handleCardSearch = (value) => {
    const cardsMatched = []

    setSearchText(value);
    cards.forEach((card) => {
      if (isCardMatch(value, card)) {
        cardsMatched.push(<RegularCard key={card._id} {...card} />)
      }
    });

    setSearchResult(cardsMatched);
  };

  useEffect(() => {
    handleCardSearch(searchText);
    
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/posts`)
        const data = await response.json();
        setCards(data);
      } catch (error) {
        console.error(error);
      } 
    };

    fetchData();

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
      {cards.length > 0 && 
      <div className="article-top-container">
        <Button variant={"primary"}>Create Article</Button>
        <Searchbar searchText={searchText} setSearchText={handleCardSearch} />
      </div>
      }
      <CardsContainer isEmpty={cards.length === 0} filterResult={searchResult} searchText={searchText}/>
    </div>
  );
};

export default ArticleSection;