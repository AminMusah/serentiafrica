import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { createClient } from "contentful";
import Loader from "../components/Loader";

function Blog() {
  const [error, setError] = useState(false);
  const [blog, setBlog] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

  useEffect(() => {
    setLoading(true);
    async function getEntries() {
      const client = createClient({
        space: import.meta.env.VITE_SPACE,
        accessToken: import.meta.env.VITE_ACCESS_TOKEN,
      });
      try {
        await client
          .getEntries({
            content_type: "blog",
          })
          .then((entries) => {
            console.log(entries.items);
            setBlog(entries.items);
            // let item = blog.map((item) => {
            //   setImage(item.fields.image.fields.file.url);
            //   console.log(item.fields.image.fields.file.url);
            //   return item;
            // });
            // console.log(item);
            // console.log(image);
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
        setError(true);
        error ? setLoading(false) : "";
      }
    }
    getEntries();
  }, []);
  return (
    <>
      <Header />
      <main>
        <article>
          <div className="blogs">
            <h2
              className="main-focus blog-title"
              style={{ marginBottom: "2rem" }}
            >
              Our Blog
            </h2>
            <p className="text-color" style={{ textAlign: "center" }}>
              Keep up to date with all the latest blogs from Serenti Africa. We
              update our blog regularly, so make sure to check back often for
              the latest news in interior design and luxury furniture. Our most
              recent posts will appear at the top of the page, and will include
              news about our founder Crystal and the company's activities around
              the world, as well as new product information and sales. For all
              the latest developments in luxury interior design,Property
              Management,Real Estate Brokage and Property Development, keep up
              with our blog!
            </p>

            <div className="blog-content">
              {loading ? (
                <Loader />
              ) : (
                blog.map((item) => {
                  return (
                    <div className="blogcard" key={item.sys.id}>
                      <figure className="blog-card-banner">
                        <img
                          src={item.fields?.image?.fields.file.url}
                          alt={item.fields.title}
                          className="w-100"
                        />
                      </figure>
                      <div className="blogcontent">
                        <div className="blogcontent-top">
                          <a href="#" className="card-meta-link">
                            <i className="ri-user-fill"></i>
                            <span>by: {item.fields.author || "Admin"}</span>
                          </a>
                          <a href="#" className="card-meta-link">
                            <i className="ri-price-tag-3-fill"></i>
                            <span>{item.fields.service || "Real estate"}</span>
                          </a>
                        </div>
                        <h3 className="h3 blogtitle">
                          <a href="#">{item.fields.title}</a>
                        </h3>
                        <div className="blogcontent-bottom">
                          <div className="publish-date">
                            <i className="ri-calendar-todo-fill"></i>
                            <time
                              datetime={new Date(
                                item.sys.createdAt
                              ).toLocaleString()}
                            >
                              {new Date(item.sys.createdAt).toLocaleString()}
                            </time>
                          </div>
                          <Link
                            to={`/blog/${item.sys.id}`}
                            className="read-more-btn"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {/* {error ? (
                <div className="not-found">
                  <div className="error-content">
                    <p>{error} :(</p>
                    <Link to="/">Go Home</Link>
                  </div>
                </div>
              ) : (
                ""
              )} */}
              {blog.length < 0 ? (
                <div className="not-found">
                  <div className="error-content">
                    <p>Oopss...Blog Post Not Found :(</p>
                    <Link to="/">Go Home</Link>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

export default Blog;
