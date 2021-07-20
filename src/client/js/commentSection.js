import fetch from "node-fetch";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const videoComment = document.getElementsByClassName("video__comment");

const addFakeComment = (comment, commentId) => {
    const ul = document.querySelector(".video__comments ul");
    const li = document.createElement("li");
    const i = document.createElement("i");
    const span = document.createElement("span");
    const deleteSpan = document.createElement("span");


    li.className = "video__comment";
    li.dataset.id = commentId;
    i.className = "fas fa-comment";
    span.innerText = ` ${comment}`;
    deleteSpan.innerText = "❌";

    li.appendChild(i);
    li.appendChild(span);
    li.appendChild(deleteSpan);
    deleteSpan.addEventListener("click", handleCommentDelete);
    ul.prepend(li);
}

const handleSubmit = async (event) => {
    event.preventDefault();
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if (text === "") {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
    });
    if (response.status === 200) {
        textarea.value = "";
    }
    const commentId = await response.json();
    addFakeComment(text, commentId.newComment);
}

const handleCommentDelete = async (e) => {
    const comment = e.target.parentElement;
    const response = await fetch(`/api/videos/${videoContainer.dataset.id}/comment/${comment.dataset.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    console.log(response);
    if (response.status === 200) {
        e.target.removeEventListener("click", handleCommentDelete);
        comment.remove();
    }
}


if (form) {
    form.addEventListener("submit", handleSubmit);
    for (let i = 0; i < videoComment.length; i++) {
        const deleteSpan = videoComment[i].querySelector(".comment-delete");
        deleteSpan.addEventListener("click", handleCommentDelete);
    }
}
