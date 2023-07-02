import React, { useState, useEffect } from "react";
import { Image, Button, Space } from "antd";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const clientID = `?client_id=${import.meta.env.VITE_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchImages = async () => {
    setLoading(true);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;
    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("data", data);
      setPhotos((oldPhotos) => {
        if (query && page === 1) {
          return data.results;
        } else if (query) {
          return [...oldPhotos, ...data.results];
        } else {
          return [...oldPhotos, ...data];
        }
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const event = window.addEventListener("scroll", () => {
      if (
        (!loading && window.innerHeight + window.scrollY) >=
        document.body.scrollHeight - 2
      ) {
        setPage((oldPage) => {
          return oldPage + 1;
        });
      }
    });

    return () => window.removeEventListener("scroll", event);
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="container">
      <Space style={{ marginBottom: 16, marginTop: 10 }}>
        <input
          type="text"
          placeholder="Search Images"
          value={query}
          style={{ width: 300 }}
          onChange={(e) => setQuery(e.target.value)}
          className="form-control"
        />
        <Button type="primary" onClick={handleSubmit}>
          Search
        </Button>
      </Space>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4, 1600: 5 }}
      >
        <Masonry gutter="1.5rem">
          {photos.map((image, index) => (
            <div key={index} className="col-md-4">
              <Image src={image.urls.regular} />
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}

export default App;
