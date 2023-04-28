import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import { createClient } from "contentful";
import Loader from "../components/Loader";

function SingleBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
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

            let item = entries.items.find((item) => {
              return item.sys.id === id;
            });

            setTitle(item.fields.title);
            setBody(item.fields.content.content[0].content[0].value);
            setAuthor(item.fields.author);
            setImage(item.fields.image.fields.file.url);
            console.log(item, image);
          });
      } catch (error) {
        console.log(error);
      }
    }
    getEntries();
  }, [image]);

  return (
    <div>
      <Header />
      <>
        <div class="post-hero">
          <div class="post-intro">
            <h1 class="single-blog-h1">{title}</h1>
          </div>
        </div>
        <div class="post-media">
          <img src={image} alt="" class="single-post-banner" />
        </div>
        <article class="post-content">
          <div class="post-author-info">
            <div class="info-text">
              <p class="author-name">{author}</p>
              <p class="read-duration">5 min read</p>
            </div>
          </div>
          <p class="post-body">{body}</p>
        </article>
      </>

      <Footer />
    </div>
  );
}

export default SingleBlog;
