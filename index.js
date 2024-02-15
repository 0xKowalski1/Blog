function init() {
  const path = window.location.pathname.substring(1);
  path ? navigateToBlog(path) : loadBlogs();
}

function loadBlogs() {
  document.getElementById("blog-content").innerHTML = "";
  fetch("/blogs/index.json")
    .then((response) => response.json())
    .then((blogs) => {
      const sortedBlogs = blogs.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      const blogsContainer = document.getElementById("blogs-container");
      blogsContainer.innerHTML = sortedBlogs
        .map((blog) => {
          const date = new Date(blog.date);
          const formattedDate = date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return `<div class="blog-card">
                    <a href="/${blog.path}" class="blog-link">${blog.name}</a>
                    <span class="blog-date">${formattedDate}</span>
                  </div>`;
        })
        .join("");
      attachLinkListeners();
    })
    .catch(() => {
      const blogContent = document.getElementById("blog-content");
      blogContent.innerHTML =
        '<div class="not-found">Page not found. <a href="/">Go back home</a>.</div>';
    });
}

function attachLinkListeners() {
  document.querySelectorAll(".blog-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigateToBlog(e.target.pathname.substring(1));
    });
  });
}

function navigateToBlog(filename) {
  history.pushState({ path: filename }, "", `/${filename}`);
  fetch(`/blogs/${filename}.md`)
    .then((response) => response.text())
    .then((markdown) => {
      const blogContent = document.getElementById("blog-content");
      blogContent.innerHTML =
        `<button onclick="loadHome()">Back to Home</button>` +
        parseMarkdown(markdown);
      document.getElementById("blogs-container").innerHTML = "";
    });
}

function loadHome() {
  history.pushState(null, "", "/");
  loadBlogs();
}

window.addEventListener("popstate", () => init());

init();
