import Button from "./Button";
import Searchbar from "./Searchbar";
import '../styles/ArticleSection.css'
import CardsContainer from "./CardsContainer";

const ArticleSection = () => {
  return (
    <div id="articleSection">
      <div className="article-sec-heading-container">
        <p className="article-sec-heading">Learn About Everything Tech!</p>
        <p className="article-sec-subheading">brought to you by AWSCC Department of Software and Web Development</p>
      </div>
      <div className="article-top-container">
        <Button variant={"primary"}>Create Article</Button>
        <Searchbar />
      </div>
      <CardsContainer />
    </div>
  );
};

export default ArticleSection;