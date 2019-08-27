const express = require("express");

const server = express();
const port = 3000;
let numberOfRequest = 0;
const projects = [];

server.use(express.json());

server.listen(port);

const checkNumerOfRequest = (req, res, next) => {
  numberOfRequest += 1;
  console.log(numberOfRequest);
  return next();
};

server.use(checkNumerOfRequest);

const checkTitle = (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  req.title = title;

  req.id = projects.length + 1;

  return next();
};

const getProject = id => {
  let project = null;
  projects.map(pro => {
    if (pro.id === parseInt(id)) {
      project = pro;
    }
  });
  return project;
};

const checkId = (req, res, next) => {
  const project = getProject(req.params.id);

  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  req.project = project;

  return next();
};

const checkTask = (req, res, next) => {
  const task = req.body.task;
  if (!task) {
    return res.status(400).json({ error: "Task is Required" });
  }
  req.task = task;

  return next();
};

server.post("/projects", checkTitle, (req, res) => {
  projects.push({ id: req.id, title: req.title, tasks: [] });
  return res.status(201).json(projects);
});

server.get("/projects", (req, res) => {
  return res.status(200).json(projects);
});

server.get("/projects/:id", checkId, (req, res) => {
  return res.status(200).json(req.project);
});

server.put("/projects/:id", checkTitle, checkId, (req, res) => {
  projects.map(project => {
    if (project.id === parseInt(req.params.id)) {
      project.title = req.title;
    }
  });
  return res.status(200).json(projects);
});

server.delete("/projects/:id", checkId, (req, res) => {
  projects.splice(req.params - 1, 1);
  return res.status(200).json({ success: "Project deleted" });
});

server.post("/projects/:id/tasks", checkId, checkTask, (req, res) => {
  projects.map(project => {
    if (project.id === req.project.id) {
      project.tasks.push(req.task);
    }
  });
  return res.status(201).json(projects);
});
