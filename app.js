//jshint esversion:6
const mongoose = require("mongoose");
var _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
mongoose.connect("mongodb://localhost:27017/postsDB");
const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const fpostsSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const postsSchema = new mongoose.Schema({
  title: String,
  content: String,
  postsf: fpostsSchema,
});
const Fpost = mongoose.model("Fpost", fpostsSchema);
const Post = mongoose.model("Post", postsSchema);
const app = express();
const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", function (req, res) {
  Post.find(function (err, post) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", { homep: post });
    }
  })
    .clone()
    .catch(function (err) {
      console.log(err);
    });
});
app.get("/about", function (req, res) {
  res.render("about", { aboutp: aboutContent });
});
app.get("/contact", function (req, res) {
  res.render("contact", { contactp: contactContent });
});
app.get("/compose", function (req, res) {
  res.render("compose");
});
app.get("/posts/:topic", async function (req, res) {
  const title = encodeURI(req.params.topic);
  console.log(title);
  Post.findOne({ title }, function (err, posta) {
    if (err) {
      console.log(err);
    } else {
      console.log(posta.title);
      res.render("full", { post: posta });
    }

    // do something
  })
    .clone()
    .catch(function (err) {
      console.log(err);
    });
});
app.post("/compose", function (req, res) {
  const post = {
    title: req.body.title,
    content: req.body.content,
  };
  var post2 = new Post({
    title: encodeURI(post.title),
    content: post.content,
    postsf: null,
  });
  post2.save();
  res.redirect("/admin");
});

app.get("/admin", function (req, res) {
  Post.find(function (err, post) {
    if (err) {
      console.log(err);
    } else {
      res.render("admin", { homep: post });
    }
  });
});
app.post("/admin", async function (req, res) {
  if (req.body.ok === "clear") {
    const dlt = req.body.idf;
    await Post.findByIdAndRemove(dlt, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted!");
        res.redirect("/admin");
      }
    })
      .clone()
      .catch(function (err) {
        console.log(err);
      });
  } else if (req.body.ok === "homeclear") {
    const dltf = req.body.idff;
    const dlt = req.body.idf;
    await Post.findById(dlt, function (err, post) {
      if (post.postsf != null) {
        console.log("hello");
        if (!err) {
          post.postsf.remove();
          post.save(function (err) {
            // do something
            console.log("delt");
          });
        }
      }
    })
      .clone()
      .catch(function (err) {
        console.log(err);
      });
    res.redirect("/");
  } else {
    const dlt = req.body.idf;
    console.log(dlt);
    const post = {
      title: req.body.titlef,
      content: req.body.contentf,
    };

    await Post.findOneAndUpdate({ _id: dlt }, { postsf: post }, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("updated");
      }
    })
      .clone()
      .catch(function (err) {
        console.log(err);
      });

    res.redirect("/");
  }
});
app.listen(PORT, function () {
  console.log("Server started on port");
});
