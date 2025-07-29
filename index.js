import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

// Setting up the express port
const app = express();
const port = process.env.PORT || 3000;

// Setting up the file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setting up EJS as the view engine
app.set("view engine", "ejs");

// Declaring the static files
app.use(express.static(__dirname + "/public"));

// Parsing the URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

function deleteBlog(id) {
    for (let i = 0; i < blogList.length; i++) {
        if (blogList[i].Id === id) {
            blogList.splice(i, 1);
        }
    }
}

let blogList = [];

app.get("/", (req, res) => {
    res.render("index", {
        blogCount: blogList.length,
        blogList: blogList,
    });
});

app.post("/add", (req, res) => {
    const id = crypto.randomUUID();
    const content = {Id: id, Content: req.body.blogInput.trim()};
    blogList.push(content)
    res.redirect("/");
});

app.post("/edit", (req, res) => {
    const id = req.body.blogId;
    const newContent = req.body.newContent;
    const blogToEdit = blogList.find(blog => blog.Id === id);
    res.sendStatus(200);
});

app.post("/delete", (req, res) => {
    const id = req.body.blogId;
    deleteBlog(id);
    res.redirect("/");
});

// Listening on the given port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});