let domLoaded;
let projectsLoaded;

document.addEventListener('DOMContentLoaded', domLoaded = function () { return new Promise((resolve) => { }) });

projectsLoaded = new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  const loginEndPointCredentials = 'https://api.github.com/graphql?access_token=5600d5cc471252c525d11fcba47b29a7b995f331';
  const queryString =
    `query{
      user(login: "CoughBall") {
          repositories(first: 50, isFork: false) {
            nodes {
              name
              url
              description
              repositoryTopics(first: 10) {
                  edges {
                    node {
                      topic {
                        name
                      }
                    }
                  }
                }
            }
          }
        }
  }`;
  xhr.open('POST', loginEndPointCredentials);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.onerror = error;
  xhr.onload = () => {
    if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
      resolve(createProjects(JSON.parse(xhr.responseText)));
    }
    else {
      error();
    }
  };
  xhr.send(
    JSON.stringify({
      query: queryString
    })
  );
  function error() {
    reject(xhr.response);
  }
});

Promise.all([domLoaded, projectsLoaded]).then((values) => 
{
  const infoSection = document.getElementsByClassName('info')[0];
  infoSection.parentNode.insertBefore(values[1], infoSection.nextSibling);
}
).catch((error) => { console.log(new Error(error)) });

function createProjects(gitHubJsonResponse) {
  let projectsSection = createProjectsSection();
  let projectsContainer = createProjectContainer();
  projectsSection.appendChild(projectsContainer);
  createProjectsElements(projectsContainer, gitHubJsonResponse);
  return projectsSection;
}

function createProjectsSection() {
  let projectsSection = document.createElement('section');
  projectsSection.setAttribute('class', 'container');
  projectsSection.setAttribute('id', 'projects');
  let projectsSectionTitle = document.createElement('h1');
  projectsSectionTitle.setAttribute('class', 'header');
  let textNode = document.createTextNode('Projects');
  projectsSectionTitle.appendChild(textNode);
  projectsSection.appendChild(projectsSectionTitle);
  return projectsSection;
}

function createProjectContainer() {
  let projectsContainer = document.createElement('div');
  projectsContainer.setAttribute('class', 'projectsContainer');
  return projectsContainer;
}

function createProjectsElements(projectsContainer, gitHubJsonResponse) {
  let project;
  for (let i = 0; i < gitHubJsonResponse.data.user.repositories.nodes.length; i++) {
    project = gitHubJsonResponse.data.user.repositories.nodes[i];
    let projectContainer = createProject(project.url);
    projectContainer.appendChild(createProjectTitle(project.name));
    projectContainer.appendChild(createProjectDescription(project.description));
    projectContainer.appendChild(createProjectTopics(project));
    projectsContainer.appendChild(projectContainer);
  }
}

function createProjectLink(project) {
  let projectLink = document.createElement('a');
  projectLink.setAttribute('href', project.html_url);
  projectLink.setAttribute('class', 'projectLink');
  return projectLink;
}

function createProject(url) {
  let projectContainer = document.createElement('a');
  projectContainer.setAttribute('href', url);
  projectContainer.setAttribute('class', 'project');
  return projectContainer;
}

function createProjectTitle(name) {
  let projectTitle = document.createElement('div');
  projectTitle.setAttribute('class', 'title');
  let projectTitleParagraphe = document.createElement('p');
  let textNode = document.createTextNode(name);
  projectTitleParagraphe.appendChild(textNode);
  projectTitle.appendChild(projectTitleParagraphe);
  return projectTitle;
}

function createProjectDescription(description) {
  let projectDescription = document.createElement('div');
  projectDescription.setAttribute('class', 'description');
  let projectDescriptionParagraphe = document.createElement('p');
  let textNode = document.createTextNode(description);
  projectDescriptionParagraphe.appendChild(textNode);
  projectDescription.appendChild(projectDescriptionParagraphe);
  return projectDescription;
}

function createProjectTopics(project) {
  let projectTags = document.createElement('div');
  projectTags.setAttribute('class', 'tags');
  let topicNodes = project.repositoryTopics.edges;
  for (let i = 0; i < topicNodes.length; i++) {
    let projectTag = document.createElement('div');
    projectTag.setAttribute('class', 'tag');
    let textNode = document.createTextNode(topicNodes[i].node.topic.name);
    projectTag.appendChild(textNode);
    projectTags.appendChild(projectTag);
  }
  return projectTags;
}