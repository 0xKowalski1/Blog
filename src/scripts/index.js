function init() {
  fetch("/blogs/index.json")
    .then((response) => response.json())
    .then((blogs) => {
      const blogsContainer = document.getElementById("blogs-container");
      blogsContainer.innerHTML = "";
      blogs.forEach((blog) => {
        const blogElement = document.createElement("div");
        blogElement.innerHTML = `<a href="#${blog.path}" class="blog-link">${blog.name}</a>`;
        blogsContainer.appendChild(blogElement);
      });
      attachLinkListeners();
    });
}

function attachLinkListeners() {
  document.querySelectorAll(".blog-link").forEach((link) => {
    link.onclick = function (e) {
      e.preventDefault();
      const filename = e.target.getAttribute("href").substring(1); // Remove the leading '#'
      navigateToBlog(filename);
    };
  });
}

function navigateToBlog(filename) {
  history.pushState({ path: filename }, "", filename);
  fetch(`/blogs/${filename}.md`)
    .then((response) => response.text())
    .then((markdown) => {
      document.getElementById("blog-content").innerHTML =
        parseMarkdown(markdown);
    });
}

window.addEventListener("popstate", function (event) {
  if (event.state && event.state.path) {
    navigateToBlog(event.state.path);
  } else {
    // Handle the case where there is no state, e.g., navigating back to the initial state
    init(); // Your initial load function to display the home page or blog list
  }
});

init();
