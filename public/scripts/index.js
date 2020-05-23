// DOM elements
// const storyList = document.querySelector(".stories");
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
const generateProjectDisplay = (display, project) => {
    var proj = "<span>ERROR</span>";
    if (display == "card") {
        proj = `<div class="col s12 m6">
        <div class="card blue-grey darken-1">
            <div class="card-content white-text">
                <span class="card-title">${project.name}</span>
                <p>${project.brief}</p>
            </div>
            <div class="card-action">
                <a href="#guide-modal" class="modal-trigger">Modal</a>
                <a onclick="M.toast({html: 'I am a toast'})" style="cursor:pointer;">Toast</a>
            </div>
        </div>
    </div>`;
    } else if (display == "collapsible") {
        proj = `<li>
      <div class="collapsible-header grey lighten-4" style="display: flex; justify-content: space-between"> <span>${project.name}</span> <span>${project.visibility}</span> </div>
      <div class="collapsible-body white"> ${project.brief} </div>
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
    if (data.length) {
        let html = "";
        data.forEach((doc) => {
            const project = doc.data();
            const li = generateProjectDisplay("collapsible", project);
            html += li;
        });
        publicProjectList.innerHTML = html;
    } else {
        publicProjectList.innerHTML =
            '<h6 id="no-projects" class="center-align">No public projects</h6>';
    }
};

// setup private projects
const setupPrivateProjects = (data) => {
    var loader = document.querySelector("#private-project-load-progress");
    loader.style.display = "none";
    var warning = document.querySelector(".no-private-projects");
    warning ? (warning.style.display = "none") : false;
    if (data.length) {
        let html = "";
        data.forEach((doc) => {
            const project = doc.data();
            const view = generateProjectDisplay("card", project);
            html += view;
        });
        privateProjectList.innerHTML = html;
    } else {
        privateProjectList.innerHTML =
            '<h6 id="no-projects" class="center-align">No private projects</h6>';
    }
};

// // setup stories
// const setupStories = (data) => {
//     if (data.length) {
//         let html = "";
//         data.forEach((doc) => {
//             const story = doc.data();
//             var persona = "As a " + story.content.persona + ",<br><br>";
//             var requirement =
//                 "I want to " + story.content.requirement + ",<br><br>";
//             var purpose = "so that I can " + story.content.purpose + ".";
//             // var user = "@" + story.user;
//             const li = `
//         <li>
//           <div class="collapsible-header grey lighten-4" style="display: flex; justify-content: space-between"> <span>${
//               story.title
//           }</span> <span>${story.author}</span> </div>
//           <div class="collapsible-body white"> ${
//               persona + requirement + purpose
//           } </div>
//         </li>
//       `;
//             html += li;
//         });
//         storyList.innerHTML = html;
//     } else {
//         storyList.innerHTML =
//             '<h5 class="center-align">Login to view stories</h5>';
//     }
// };

// setup materialize components
document.addEventListener("DOMContentLoaded", function () {
    var modals = document.querySelectorAll(".modal");
    M.Modal.init(modals);

    var items = document.querySelectorAll(".collapsible");
    M.Collapsible.init(items);
});
