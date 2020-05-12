// DOM elements
const storyList = document.querySelector(".stories");
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
    } else {
        // clear account info
        accountDetails.innerHTML = "";
        // toggle user elements
        adminItems.forEach((item) => (item.style.display = "none"));
        loggedInLinks.forEach((item) => (item.style.display = "none"));
        loggedOutLinks.forEach((item) => (item.style.display = "block"));
    }
};

// setup stories
const setupStories = (data) => {
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
        storyList.innerHTML = html;
    } else {
        storyList.innerHTML =
            '<h5 class="center-align">Login to view stories</h5>';
    }
};

// setup materialize components
document.addEventListener("DOMContentLoaded", function () {
    var modals = document.querySelectorAll(".modal");
    M.Modal.init(modals);

    var items = document.querySelectorAll(".collapsible");
    M.Collapsible.init(items);
});
