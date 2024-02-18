let blogs = [];

const init = () => {
  const path = window.location.pathname.substring(1);
  path ? navigateToBlog(path) : loadBlogs();
};

const loadBlogs = async () => {
  history.pushState(null, "", "/");
  if (!blogs.length) blogs = await (await fetch("/blogs/index.json")).json();

  const blogsContainer = document.getElementById("blogs-container");
  blogsContainer.innerHTML = blogs
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(
      (blog) => `<div class="blog-card">
                        <a href="/${blog.path}" class="blog-link">${
        blog.name
      }</a>
                        <span class="blog-date">${new Date(
                          blog.date
                        ).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}</span>
                      </div>`
    )
    .join("");
  document.getElementById("blog-content").innerHTML = "";
  attachLinkListeners();
};

const attachLinkListeners = () => {
  document.querySelectorAll(".blog-link").forEach(
    (link) =>
      (link.onclick = (e) => {
        e.preventDefault();
        navigateToBlog(e.target.pathname.substring(1));
      })
  );
};

const navigateToBlog = (filename) => {
  history.pushState({ path: filename }, "", `/${filename}`);
  fetch(`/blogs/${filename}.md`)
    .then((response) => response.text())
    .then((markdown) => {
      document.getElementById("blogs-container").innerHTML = "";
      const blogContent = document.getElementById("blog-content");
      blogContent.innerHTML = markdown.includes("<!DOCTYPE html>") // simple way to handle 404s, as vercel will respond with index.html if no blog is found.
        ? `<button onclick="loadBlogs()">Back to Home</button><h1>404</h1><div>Oops! '${filename}' does not exist!</div>`
        : `<button onclick="loadBlogs()">Back to Home</button>${parseMarkdown(
            markdown
          )}`;
    });
};

window.addEventListener("popstate", init);
init();
