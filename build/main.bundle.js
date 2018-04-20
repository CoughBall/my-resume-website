'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var gitHubJsonResponse = void 0;
var projectsContainer = void 0;
var projectsSection = void 0;
var DOM_READY = 0x1;
var XHR_READY = 0x2;
var ALL_READY = 0x3;
var documentReady = 0;

document.addEventListener('DOMContentLoaded', function () {
  documentReady |= DOM_READY;
});

(function waitFunc() {
  if (documentReady == ALL_READY) {
    var infoSection = document.getElementsByClassName('info')[0];
    infoSection.parentNode.insertBefore(projectsSection, infoSection.nextSibling);
  } else {
    setTimeout(waitFunc, 10);
  }
})();

(function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var xhr;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            xhr = new XMLHttpRequest();

            xhr.open('POST', 'https://api.github.com/graphql?access_token=5600d5cc471252c525d11fcba47b29a7b995f331');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.onload = function () {
              if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
                gitHubJsonResponse = JSON.parse(xhr.responseText);
                createProjects();
                documentReady |= XHR_READY;
              }
            };
            xhr.onerror = function () {
              console.log('data returned:', xhr.response);
            };
            xhr.send(JSON.stringify({
              query: ' \n            query{\n                user(login: "CoughBall") {\n                    repositories(first: 50, isFork: false) {\n                      nodes {\n                        name\n                        url\n                        description\n                        repositoryTopics(first: 10) {\n                            edges {\n                              node {\n                                topic {\n                                  name\n                                }\n                              }\n                            }\n                          }\n                      }\n                    }\n                  }\n            }\n                  '
            }));

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function load() {
    return _ref.apply(this, arguments);
  }

  return load;
})()();

function createProjects() {
  createProjectsSection();
  var projectsContainer = createProjectContainer();
  projectsSection.appendChild(projectsContainer);
  createProjectsElements(projectsContainer);
}

function createProjectsSection() {
  projectsSection = document.createElement('section');
  projectsSection.setAttribute('class', 'container');
  projectsSection.setAttribute('id', 'projects');
  var projectsSectionTitle = document.createElement('h1');
  projectsSectionTitle.setAttribute('class', 'header');
  var textNode = document.createTextNode('Projects');
  projectsSectionTitle.appendChild(textNode);
  projectsSection.appendChild(projectsSectionTitle);
}

function createProjectContainer() {
  var projectsContainer = document.createElement('div');
  projectsContainer.setAttribute('class', 'projectsContainer');
  return projectsContainer;
}

function createProjectsElements(projectsContainer) {
  var project = void 0;
  for (var i = 0; i < gitHubJsonResponse.data.user.repositories.nodes.length; i++) {
    project = gitHubJsonResponse.data.user.repositories.nodes[i];
    var projectContainer = createProject(project.url);
    projectContainer.appendChild(createProjectTitle(project.name));
    projectContainer.appendChild(createProjectDescription(project.description));
    projectContainer.appendChild(createProjectTopics(project));
    projectsContainer.appendChild(projectContainer);
  }
}

function createProjectLink(project) {
  var projectLink = document.createElement('a');
  projectLink.setAttribute('href', project.html_url);
  projectLink.setAttribute('class', 'projectLink');
  return projectLink;
}

function createProject(url) {
  var projectContainer = document.createElement('a');
  projectContainer.setAttribute('href', url);
  projectContainer.setAttribute('class', 'project');
  return projectContainer;
}

function createProjectTitle(name) {
  var projectTitle = document.createElement('div');
  projectTitle.setAttribute('class', 'title');
  var projectTitleParagraphe = document.createElement('p');
  var textNode = document.createTextNode(name);
  projectTitleParagraphe.appendChild(textNode);
  projectTitle.appendChild(projectTitleParagraphe);
  return projectTitle;
}

function createProjectDescription(description) {
  var projectDescription = document.createElement('div');
  projectDescription.setAttribute('class', 'description');
  var projectDescriptionParagraphe = document.createElement('p');
  var textNode = document.createTextNode(description);
  projectDescriptionParagraphe.appendChild(textNode);
  projectDescription.appendChild(projectDescriptionParagraphe);
  return projectDescription;
}

function createProjectTopics(project) {
  var projectTags = document.createElement('div');
  projectTags.setAttribute('class', 'tags');
  var topicNodes = project.repositoryTopics.edges;
  for (var i = 0; i < topicNodes.length; i++) {
    var projectTag = document.createElement('div');
    projectTag.setAttribute('class', 'tag');
    var textNode = document.createTextNode(topicNodes[i].node.topic.name);
    projectTag.appendChild(textNode);
    projectTags.appendChild(projectTag);
  }
  return projectTags;
}
