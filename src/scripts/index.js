function init() {
  const path = window.location.pathname.substring(1);
  path ? navigateToBlog(path) : loadBlogs();
}

function loadBlogs() {
  fetch("/blogs/index.json")
    .then((response) => response.json())
    .then((blogs) => {
      const blogsContainer = document.getElementById("blogs-container");
      blogsContainer.innerHTML = blogs
        .map(
          (blog) =>
            `<div><a href="/${blog.path}" class="blog-link">${blog.name}</a></div>`
        )
        .join("");
      attachLinkListeners();
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
  document.getElementById("blog-content").innerHTML = "";
}

window.addEventListener("popstate", () => init());

init();
