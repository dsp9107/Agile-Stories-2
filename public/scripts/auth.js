// // add admin cloud function
// const adminForm = document.querySelector(".admin-actions");
// adminForm.addEventListener("submit", (e) => {
//     e.preventDefault();

//     const adminEmail = document.querySelector("#admin-email").value;
//     const addAdminRole = functions.httpsCallable("addAdminRole");
//     addAdminRole({ email: adminEmail }).then((result) => {
//         console.log(result);
//     });
// });

// listen for auth status changes
auth.onAuthStateChanged((user) => {
    if (user) {
        user.getIdTokenResult().then((idTokenResult) => {
            user.admin = idTokenResult.claims.admin;
            setupUI(user);
        });
        db.collection("projects")
            .where("members", "array-contains", user.uid)
            .onSnapshot(
                (snapshot) => {
                    setupPrivateProjects(snapshot.docs);
                },
                (err) => {
                    console.log(err.message);
                    setupPrivateProjects([]);
                }
            );

        // db.collection("stories").onSnapshot(
        //     (snapshot) => {
        //         setupPrivateStories(snapshot.docs);
        //     },
        //     (err) => {
        //         console.log(err.message);
        //         setupPrivateStories([]);
        //     }
        // );
    } else {
        setupUI();
    }
    db.collection("projects")
        .where("visibility", "==", "public")
        .onSnapshot(
            (snapshot) => {
                setupPublicProjects(snapshot.docs);
            },
            (err) => {
                console.log(err.message);
                setupPublicProjects([]);
            }
        );

    // db.collection("stories").onSnapshot(
    //     (snapshot) => {
    //         setupPublicStories(snapshot.docs);
    //     },
    //     (err) => {
    //         console.log(err.message);
    //         setupPublicStories([]);
    //     }
    // );
});

// add new project
const projectForm = document.querySelector("#project-form");
projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log();
    db.collection("projects")
        .add({
            name: projectForm.name.value,
            owner: auth.getUid(),
            stories: [],
            members: [auth.getUid()],
            visibility: projectForm.visibility.checked ? "public" : "private",
            brief: projectForm.brief.value,
        })
        .then(() => {
            const modal = document.querySelector("#modal-new-project");
            M.Modal.getInstance(modal).close();
            projectForm.reset();
        })
        .catch((err) => {
            console.log(err.message);
        });
});

// create new story
const formCreateStory = document.querySelector("#form-create-story");
formCreateStory.addEventListener("submit", (e) => {
    e.preventDefault();
    const userN = auth.getUid();
    db.collection("users")
        .doc(userN)
        .get()
        .then((doc) => {
            return doc.data().username;
        })
        .then((username) => {
            return db.collection("stories").add({
                title: formCreateStory.title.value,
                content: {
                    persona: formCreateStory.persona.value,
                    purpose: formCreateStory.purpose.value,
                    requirement: formCreateStory.requirement.value,
                },
                author: username,
            });
        })
        .then((ref) => {
            db.collection("projects")
                .doc(window.lastAnchorClicked.dataset.project)
                .update({
                    stories: firebase.firestore.FieldValue.arrayUnion(ref.id),
                });
            // close the create modal & reset form
            const modal = document.querySelector("#modal-create-story");
            M.Modal.getInstance(modal).close();
            formCreateStory.reset();
        })
        .catch((err) => {
            console.log(err.message);
        });
});

// signup
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // get user info
    const email = signupForm["signup-email"].value;
    const password = signupForm["signup-password"].value;

    // sign up the user & add firestore data
    auth.createUserWithEmailAndPassword(email, password)
        .then((cred) => {
            return db.collection("users").doc(cred.user.uid).set({
                bio: signupForm["signup-bio"].value,
            });
        })
        .then(() => {
            // close the signup modal & reset form
            const modal = document.querySelector("#modal-signup");
            M.Modal.getInstance(modal).close();
            signupForm.reset();
            signupForm.querySelector(".error").innerHTML = "";
        })
        .catch((err) => {
            signupForm.querySelector(".error").innerHTML = err.message;
        });
});

// logout
const logoutTriggers = document.querySelectorAll(".logout-fx");
logoutTriggers.forEach((logoutTrigger) => {
    logoutTrigger.addEventListener("click", (e) => {
        e.preventDefault();
        auth.signOut();
    });
});

// login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // get user info
    const email = loginForm["login-email"].value;
    const password = loginForm["login-password"].value;

    // log the user in
    auth.signInWithEmailAndPassword(email, password)
        .then((cred) => {
            // close the signup modal & reset form
            const modal = document.querySelector("#modal-login");
            M.Modal.getInstance(modal).close();
            loginForm.reset();
            loginForm.querySelector(".error").innerHTML = "";
        })
        .catch((err) => {
            loginForm.querySelector(".error").innerHTML = err.message;
        });
});
