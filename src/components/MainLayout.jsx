import { useFetchNews } from "../service/api";
import { useSelector, useDispatch } from "react-redux";
import { saveNews, unsaveNews } from "../store/newsSaved";
import image from "../assets/img.png";
import PropTypes from "prop-types";

function MainLayout({ query }) {
  const savedNews = useSelector((state) => state.news.data);
  const dispatch = useDispatch();

  // mengammbil data berita menggunakan hook
  const { data, isLoading, isError } = useFetchNews(query);

  const handleSave = (item) => {
    if (isSaved(item)) {
      dispatch(unsaveNews(item));
    } else {
      dispatch(saveNews(item));
    }
  };

  const isSaved = (item) => savedNews.some((news) => news._id === item._id); //memeriksa berita apakah sudah tersimpan di reducer

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5" style={{ height: "62vh" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5" style={{ height: "62vh" }}>
        <h1>Error fetching data</h1>
      </div>
    );
  }
  return (
    // menampilkan data berita
    <>
      {data.map((item) => (
        <div key={item._id} className="col-md-6 col-lg-4 d-flex justify-content-center mb-4">
          <div className="card border-0 p-3 mb-5 mt-5" style={{ width: "18rem", transition: "transform 0.4s ease" }}>
            <img src={item.multimedia?.[0]?.url ? `https://www.nytimes.com/${item.multimedia[0].url}` : image} className="card-img-top rounded" alt={item.headline.main} style={{ height: "256px", width: "100%" }} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{item.headline.main}</h5> {/* untuk judul berita*/}
              <p className="card-text">
                <small className="text-muted">{item.byline?.original || "By Unknown"}</small> {/* untuk pembuat*/}
              </p>
              <p className="card-text">{item.abstract ? (item.abstract.length > 500 ? `${item.abstract.slice(0, 100)}...` : item.abstract) : "Not Description"}</p> {/* untuk deskripsinya*/}
              <div className="mt-auto">
                <a href={item.web_url} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
                  Read More
                </a>
                <button className={`btn mx-2 ${isSaved(item) ? "btn-danger" : "btn-info text-white"}`} onClick={() => handleSave(item)}>
                  {isSaved(item) ? "Unsave" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

MainLayout.propTypes = {
  query: PropTypes.string.isRequired,
};

export default MainLayout;
