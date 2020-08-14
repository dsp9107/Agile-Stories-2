// DOM elements
const publicStoryList = document.querySelector(".public-stories");
const privateStoryList = document.querySelector(".private-stories");
const publicProjectList = document.querySelector(".public-projects");
const publicProjectContainer = document.querySelector(
    ".public-project-container"
);
const privateProjectList = document.querySelector(".private-projects");
const privateProjectContainer = document.querySelector(
    ".private-project-container"
);
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
const accountDetails = document.querySelector(".account-details");
const adminItems = document.querySelectorAll(".admin");

const setupUI = (user) => {
    if (user) {
        if (user.admin) {
            adminItems.forEach((item) => (item.style.display = "block"));
        }
        // account info
        db.collection("users")
            .doc(user.uid)
            .get()
            .then((doc) => {
                const html = `
        <div>Logged in as ${user.email}</div>
        <div>${doc.data().bio}</div>
        <div class="pink-text">${user.admin ? "Admin" : ""}</div>
      `;
                accountDetails.innerHTML = html;
            });
        // toggle user UI elements
        loggedInLinks.forEach((item) => (item.style.display = "block"));
        loggedOutLinks.forEach((item) => (item.style.display = "none"));

        privateProjectContainer.style.display = "block";
    } else {
        // clear account info
        accountDetails.innerHTML = "";
        // toggle user elements
        adminItems.forEach((item) => (item.style.display = "none"));
        loggedInLinks.forEach((item) => (item.style.display = "none"));
        loggedOutLinks.forEach((item) => (item.style.display = "block"));

        privateProjectContainer.style.display = "none";
    }
};

// generate project display
const generateProjectDisplay = (display, data) => {
    var proj = "<span>ERROR</span>";
    if (display == "card") {
        proj = `<div class="col s12 m6">
        <div class="card blue-grey darken-1">
            <div class="card-content white-text">
                <span class="card-title">${data.project.name}</span>
                <p>${data.project.brief}</p>
            </div>
            <div class="card-action">
                <a href="#modal-create-story" class="modal-trigger" data-project=${
                    data.id
                } onclick="window.lastAnchorClicked = this;">New Story</a>
                ${
                    /*<a onclick="M.toast({html: 'I am a toast'})" style="cursor:pointer;">Toast</a>*/ ""
                }
            </div>
        </div>
    </div>`;
    } else if (display == "collapsible") {
        proj = `<li>
      <div class="collapsible-header grey lighten-4" style="display: flex; justify-content: space-between"> <span>${data.project.name}</span> <span>${data.project.visibility}</span> </div>
      <div class="collapsible-body white"> ${data.project.brief} </div>
    </li>`;
    }
    return proj;
};

// setup public projects
const setupPublicProjects = (data) => {
    var loader = document.querySelector("#public-project-load-progress");
    loader.style.display = "none";
    var warning = document.querySelector(".no-public-projects");
    warning ? (warning.style.display = "none") : false;
    let stories = [];
    if (data.length) {
        let html = "";
        data.forEach((doc) => {
            const project = doc.data();
            const li = generateProjectDisplay("collapsible", { project });
            html += li;
            stories.push(project.stories);
        });
        publicProjectList.innerHTML = html;
    } else {
        publicProjectList.innerHTML =
            '<h6 id="no-projects" class="center-align">No public projects</h6>';
    }

    stories.forEach((storyList) => {
        db.collection("stories")
            .where(firebase.firestore.FieldPath.documentId(), "in", storyList)
            .get()
            .then((querySnapshot) => {
                setupPublicStories(querySnapshot.docs);
            })
            .catch((err) => {
                console.log(err.message);
                setupPublicStories([]);
            });
    });
};

// setup private projects
const setupPrivateProjects = (data) => {
    var loader = document.querySelector("#private-project-load-progress");
    loader.style.display = "none";
    var warning = document.querySelector(".no-private-projects");
    warning ? (warning.style.display = "none") : false;
    let stories = [];
    if (data.length) {
        let html = "";
        data.forEach((doc) => {
            const project = doc.data();
            const view = generateProjectDisplay("card", {
                id: doc.id,
                project,
            });
            html += view;
            stories.push(project.stories);
        });
        privateProjectList.innerHTML = html;
    } else {
        privateProjectList.innerHTML =
            '<h6 id="no-projects" class="center-align">No projects yet.</h6>';
    }

    stories.forEach((storyList) => {
        db.collection("stories")
            .where(firebase.firestore.FieldPath.documentId(), "in", storyList)
            .get()
            .then((querySnapshot) => {
                setupPrivateStories(querySnapshot.docs);
            })
            .catch((err) => {
                console.log(err.message);
                setupPrivateStories([]);
            });
    });
};

// setup public stories
const setupPublicStories = (data) => {
    var loader = document.querySelector("#public-story-load-progress");
    loader.style.display = "none";
    if (data.length) {
        let html = "";
        data.forEach((doc) => {
            const story = doc.data();
            var persona = "As a " + story.content.persona + ",<br><br>";
            var requirement =
                "I want to " + story.content.requirement + ",<br><br>";
            var purpose = "so that I can " + story.content.purpose + ".";
            // var user = "@" + story.user;
            const li = `
        <li>
          <div class="collapsible-header grey lighten-4" style="display: flex; justify-content: space-between"> <span>${
              story.title
          }</span> <span>${story.author}</span> </div>
          <div class="collapsible-body white"> ${
              persona + requirement + purpose
          } </div>
        </li>
      `;
            html += li;
        });
        publicStoryList.innerHTML = html;
    } else {
        publicStoryList.innerHTML =
            '<h5 class="center-align">Login to view stories</h5>';
    }
};

// setup private stories
const setupPrivateStories = (data) => {
    var loader = document.querySelector("#private-story-load-progress");
    loader.style.display = "none";
    if (data.length) {
        let html = "";
        data.forEach((doc) => {
            const story = doc.data();
            var persona = "As a " + story.content.persona + ",<br><br>";
            var requirement =
                "I want to " + story.content.requirement + ",<br><br>";
            var purpose = "so that I can " + story.content.purpose + ".";
            // var user = "@" + story.user;
            const li = `
        <li>
          <div class="collapsible-header grey lighten-4" style="display: flex; justify-content: space-between"> <span>${
              story.title
          }</span> <span>${story.author}</span> </div>
          <div class="collapsible-body white"> ${
              persona + requirement + purpose
          } </div>
        </li>
      `;
            html += li;
        });
        privateStoryList.innerHTML = html;
    } else {
        privateStoryList.innerHTML =
            '<h6 class="center-align">No stories yet.</h6>';
    }
};

// setup materialize components
document.addEventListener("DOMContentLoaded", function () {
    var modals = document.querySelectorAll(".modal");
    M.Modal.init(modals);

    var items = document.querySelectorAll(".collapsible");
    M.Collapsible.init(items);
});
