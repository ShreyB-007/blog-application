document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('.Blogs');

    mainContainer.addEventListener("click", async (event) => {
        const action = event.target.dataset.action;
        const blogContainer = event.target.closest('.blog-container');

        const blogId = blogContainer.dataset.blogId;
        const blogContent = blogContainer.querySelector(".blogContent");

        const editBtn = blogContainer.querySelector('.edit-btn');
        const confirmBtn = blogContainer.querySelector('.confirm-btn');
        const deleteBtn = blogContainer.querySelector('.delete-btn');
        const cancelBtn = blogContainer.querySelector('.cancel-btn');

        const editForm = blogContainer.querySelector('form[action="/edit"]');
        const deleteForm = blogContainer.querySelector('form[action="/delete"]');

        switch(action) {
            case "edit":
                blogContainer.dataset.originalContent = blogContent.textContent;

                const textarea = document.createElement('textarea');
                textarea.className = 'form-control form-control-lg blogInput p-0 mb-3';
                textarea.name = 'newContent';
                textarea.rows = 4;
                textarea.value = blogContent.textContent.trim();

                blogContent.replaceWith(textarea);

                editBtn.classList.add('d-none');
                deleteBtn.classList.add('d-none');
                confirmBtn.classList.remove('d-none');
                cancelBtn.classList.remove('d-none');

                textarea.focus();
                break;

            case "cancel":
                const currentText = blogContainer.querySelector('textarea');
                const originalP = document.createElement('p');

                originalP.className = 'blogContent';

                originalP.textContent = blogContainer.dataset.originalContent;
                originalP.style.whiteSpace = 'pre-line';
                currentText.replaceWith(originalP);

                editBtn.classList.remove('d-none');
                deleteBtn.classList.remove('d-none');
                confirmBtn.classList.add('d-none');
                cancelBtn.classList.add('d-none');
                break;

            case "confirm":
                const currentTextArea = blogContainer.querySelector('textarea');
                let newContent = currentTextArea.value.trim();

                try {
                    const response = await fetch('/edit', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        body: new URLSearchParams({
                            blogId: blogId,
                            newContent: newContent
                        }).toString()
                    });

                    if (response.ok) {
                        const updatedP = document.createElement('p');
                        updatedP.className = 'blogContent';
                        updatedP.textContent = newContent;
                        updatedP.style.whiteSpace = 'pre-line';
                        currentTextArea.replaceWith(updatedP);
                        
                        editBtn.classList.remove('d-none');
                        deleteBtn.classList.remove('d-none');
                        confirmBtn.classList.add('d-none');
                        cancelBtn.classList.add('d-none');
                    } else {
                        console.error("Failed to update the blog, server error:", response.status);
                        alert("Server error, failed to save changes.");
                    }
                } catch (error) {
                    console.error("Network error while updating blog!", error);
                    alert("Network error! Check your connection.");
                }
                break;
        }
    });
});