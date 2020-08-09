const searchForm = document.querySelector('#github-form');
const userListUl = document.querySelector("#user-list");
const githubContainerDiv = document.querySelector("#github-container");
const repoListUl = document.querySelector("#repos-list");

searchForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const searchInput = evt.target.search.value;

  if (evt.target["repo-checkbox"].checked){
    fetch(`https://api.github.com/search/repositories?q=${searchInput}`, {
    headers: { Accept: 'application/vnd.github.v3+json' }
  }).then(response => response.json())
    .then(resultObject => {
      const repoObjectsArray = resultObject.items;
      repoObjectsArray.forEach(repoObject => displayRepoInfoOnDOM(repoObject))
    });
  } else {
  fetch(`https://api.github.com/search/users?q=${searchInput}`, {
    headers: { Accept: 'application/vnd.github.v3+json' }
  }).then(response => response.json())
    .then(resultObject => {
      const userObjectsArray = resultObject.items;
      userObjectsArray.forEach(userObject => displayUserInfoOnDOM(userObject))
    });
  }
})

function displayUserInfoOnDOM(userObject) {
  repoListUl.innerHTML = '';

  const userLi = document.createElement("li");
  const userUl = document.createElement("ul");
  const usernameLi = document.createElement("li");
  usernameLi.innerText = userObject.login;

  const avatarLi = document.createElement("li");
  const avatarImg = document.createElement("img");
  avatarImg.src = userObject.avatar_url;
  avatarLi.append(avatarImg);

  const profileLi = document.createElement("li");
  const profileAnchor = document.createElement("a");
  profileAnchor.href = userObject.html_url;
  profileAnchor.innerText = "Link to Profile"
  profileLi.append(profileAnchor);

  const line = document.createElement("hr");


  userUl.append(usernameLi, avatarLi, profileLi)
  userLi.append(userUl);
  userListUl.append(userLi, line);

  usernameLi.addEventListener("click", (evt) => {
    
    fetch(`https://api.github.com/users/${userObject.login}/repos`)
      .then(response => response.json())
      .then(userReposArray => {
        userReposArray.forEach(userRepoObject => displayRepoInfoOnDOM(userRepoObject))
      })
  })

}

function displayRepoInfoOnDOM(userRepoObject) {
  // display name, url, description
  userListUl.innerHTML = '';


  const repoLi = document.createElement("li");
  const repoUl = document.createElement("ul");
  const repoNameLi = document.createElement("li");
  repoNameLi.innerText = userRepoObject.name;

  const repoUrlLi = document.createElement("li");
  const repoUrlAnchor = document.createElement("a");
  repoUrlAnchor.href = userRepoObject.html_url;
  repoUrlAnchor.innerText = "Link to Repo"
  repoUrlLi.append(repoUrlAnchor);

  const repoDescriptionLi = document.createElement("li");
  repoDescriptionLi.innerText = userRepoObject.description;

  repoUl.append(repoNameLi, repoUrlLi, repoDescriptionLi);
  repoLi.append(repoUl);
  repoListUl.append(repoLi);
}