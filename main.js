"use strict";

const tabs = document.querySelectorAll(".tab-btn");
const content = document.querySelectorAll(".tab-content");
const mainTabs = document.querySelectorAll(".main-tab-btn");
const mainContent = document.querySelectorAll(".main-tab-content");

// add event on multiple elements

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};

// navbar functionality

const [navbar, navToggler, navbarLinks] = [
  document.querySelector("[data-navbar]"),
  document.querySelector("[data-nav-toggler]"),
  document.querySelectorAll("[data-nav-link]"),
];

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  this.classList.toggle("active");
  document.body.classList.toggle("active");
};

navToggler.addEventListener("click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
  document.body.classList.remove("active");
};

addEventOnElements(navbarLinks, "click", closeNavbar);

// header active

const header = document.querySelector("[data-header]");

const activeElemOnScroll = function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
};

window.addEventListener("scroll", activeElemOnScroll);

// scroll reveal effect

const revealElements = document.querySelectorAll("[data-reveal]");

const revealOnScroll = function () {
  for (let i = 0; i < revealElements.length; i++) {
    // add revealed class on element, when visible in window
    if (
      revealElements[i].getBoundingClientRect().top <
      window.innerHeight / 1.1
    ) {
      revealElements[i].classList.add("revealed");

      // remove long transition from button, after 1 second
      if (revealElements[i].classList.contains("btn")) {
        setTimeout(function () {
          revealElements[i].style.transition = "0.25s ease";
        }, 1000);
      }
    }
  }
};

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();

//tabs

tabs.forEach((tab, index) => {
  tabs[index].classList.remove("active");

  tab.addEventListener("click", () => {
    content.forEach((contents) => {
      contents.classList.remove("active-content");
    });

    content[index].classList.add("active-content");
    tabs[index].classList.add("active");
  });
});

mainTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    tab.classList.remove("active");
    mainContent.forEach((contents) => {
      contents.classList.remove("main-active-content");
    });

    mainContent[index].classList.add("main-active-content");
    tabs[index].classList.add("active");
  });
});

//year
const year = document.getElementById("year");
const currentYear = new Date();
year.innerHTML = currentYear.getFullYear();

//contentful

// const client = contentful.createClient({
//   space: process.env.SPACE,
//   accessToken: process.env.ACCESS_TOKEN
// })

// client.getEntries({
//   content_type:'blog'
// })
// .then((response) => console.log(response.items))
// .catch(console.error)

const container = document.querySelector(".blog-content");

{
  /* <img
src="${item.fields.image.fields.file.url}"
alt="${item.fields.title}"
class="w-100"
/>
</figure>

<div class="blogcontent">
<div class="blogcontent-top">
<a href="#" class="card-meta-link">
  <i class="ri-user-fill"></i>
  <span>by: ${item.fields.author || 'Admin'}</span>
</a>

<a href="#" class="card-meta-link">
  <i class="ri-price-tag-3-fill"></i>
  <span>${item.fields.service || 'Real estate'}</span>
</a>
</div>
<h3 class="h3 blogtitle">
<a href="#">${item.fields.title}</a>
</h3>
<div class="blogcontent-bottom">
<div class="publish-date">
  <i class="ri-calendar-todo-fill"></i>
  <time datetime="${new Date(
    item.sys.createdAt
  ).toLocaleString()}">${new Date(
item.sys.createdAt
).toLocaleString()}</time>
</div>

<a href="#" class="read-more-btn" data-post-id="${
  item.sys.id
}">Read More</a> */
}

client
  .getEntries({
    content_type: "blog",
  })
  .then((entries) => {
    console.log(entries);
    const html = entries.items
      .map(
        (item) => `
        <div class="blogcard">
        <figure class="blog-card-banner" data-reveal>
          <img
            src="${item.fields.title}"
            alt="${item.fields.image.fields.file.url}"
            class="w-100"
          />
        </figure>

        <div class="blogcontent">
          <div class="blogcontent-top">
            <a href="#" class="card-meta-link">
              <i class="ri-user-fill"></i>
              <span>by: ${item.fields.author || "Admin"}</span>
            </a>

            <a href="#" class="card-meta-link">
              <i class="ri-price-tag-3-fill"></i>
              <span>${item.fields.service || "Real estate"}</span>
            </a>
          </div>
          <h3 class="h3 blogtitle">
            <a href="#">${item.fields.title}</a>
          </h3>
          <div class="blogcontent-bottom">
            <div class="publish-date">
              <i class="ri-calendar-todo-fill"></i>
              <time datetime="${new Date(
                item.sys.createdAt
              ).toLocaleString()}">${new Date(
          item.sys.createdAt
        ).toLocaleString()}</time>
            </div>

            <a href="#" class="read-more-btn">Read More</a>
          </div>
        </div>
      </div>
  `
      )
      .join(" ");
    container.innerHTML = html;
  })
  .catch((error) => {
    console.log(error);
    if (error) {
      container.innerHTML = `  
      <div  class="not-found">
        <div class="error-content">
            <p>${error} :(</p> 
            <a href="/index.html">Go Home</a>
        </div>
      </div>`;
    } else {
      container.innerHTML = `  
      <div  class="not-found">
        <div class="error-content">
            <p>Oopss...Blog Post Not Found :(</p>
            <a href="/index.html">Go Home</a>
        </div>
      </div>`;
    }
  });

const singleBlog = `<header class="header">
<div class="header-bottom" data-header>
  <div class="container">
    <a href="blog.html" class="logo">
      <img
        src="images/7D1CAE8D-5631-415E-A139-0B95215A0B9F-removebg.png"
        width="216"
        height="80"
        alt="serenti"
        class="w-100"
      />
    </a>

    <a href='/blog.html' data-navbar style="color: white">
    < Go Back
    </a>
  </div>
</div>
</header>
<main>
<div class="post-hero">
  <div class="post-intro">
    <h1 class="single-blog-h1">Lorem</h1>
  
  </div>
</div>
<div class="post-media">
  <img
    src="/images/photo_6034830961490902251_y.jpg"
    alt=""
    class="single-post-banner"
  />
</div>
<article class="post-content">
  <div class="post-author-info">
    <div class="info-text">
    <p class="author-name">Linda Edwards</p>
    <p class="read-duration">5 min read</p>
    </div>
  </div>
  <p class="post-body">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Non autem
    atque obcaecati saepe quae veniam, corrupti voluptas asperiores natus
    aliquid quisquam vel deleniti modi laudantium possimus itaque! Magni
    perspiciatis aspernatur doloremque debitis corporis pariatur voluptate
    repellat adipisci vitae officia quas enim, quos natus quis tempore
    minus ipsum sint qui recusandae tenetur. Corrupti commodi iusto
    consequuntur vel pariatur maxime quia totam! Alias eveniet odio,
    molestias aliquam explicabo, qui expedita voluptate deleniti enim
    cupiditate doloribus nesciunt quia iusto! Cum eius quaerat
    exercitationem officiis necessitatibus ad dicta adipisci numquam nemo
    debitis accusantium labore distinctio impedit earum inventore porro
    qui voluptatibus ipsa odit ipsam, doloribus velit asperiores. Harum
    rerum odio reprehenderit eveniet distinctio laboriosam ipsum excepturi
    commodi animi a facere, iste provident sapiente similique, maxime
    assumenda amet illum quasi ipsam praesentium voluptate. Quibusdam
    placeat adipisci fuga magnam sequi odio iusto earum rerum vel, labore
    eius aliquam fugiat! Qui, ipsum itaque nostrum sapiente quia odit
    pariatur ipsam aut consectetur, quidem et esse tenetur magni laborum
    autem eius illum ducimus atque quo hic. Beatae modi quisquam sapiente
    quia minus assumenda qui, ducimus ea non ipsum, laudantium placeat
    natus accusantium at aperiam in maxime animi harum ad saepe,
    perspiciatis quidem cum nostrum eligendi. Magnam amet vitae nobis.
  </p>
</article>
</main>
<script src="bundle.js"></script>
`;

container.addEventListener("click", (event) => {
  const target = event.target.closest(".read-more-btn");

  if (target) {
    const htmlString = singleBlog;

    document.querySelector("body").innerHTML = htmlString;
    const postId = target.dataset.postId; // Replace with the actual data attribute name
    let url = window.location.href;
    if (url) {
      client
        .getEntries({
          content_type: "blog",
        })
        .then((entries) => {
          const hello = entries.items.filter((item) => {
            return postId === item.sys.id;
          });
          document.body.querySelector(".single-blog-h1").innerHTML =
            hello[0].fields.title;
          document.body.querySelector(".post-body").innerHTML =
            hello[0].fields.content.content[0].content[0].value;
          document.body.querySelector(".single-post-banner").src =
            hello[0].fields.image.fields.file.url;
          document.body.querySelector(".author-name").innerHTML =
            hello[0].fields.author || "Admin";
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
});
