let accordian = document.getElementsByClassName("FAQ__title");

for (let i = 0; i < accordian.length; i++) {
  accordian[i].addEventListener("click", function () {
    if (this.childNodes[1].classList.contains("fa-plus")) {
      this.childNodes[1].classList.remove("fa-plus");
      this.childNodes[1].classList.add("fa-times");
    } else {
      this.childNodes[1].classList.remove("fa-times");
      this.childNodes[1].classList.add("fa-plus");
    }

    let content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}

// Lấy các phần tử cần thiết
const signinButton = document.querySelector('.signin__button');
const modal = document.getElementById('login-modal');
const span = document.getElementsByClassName('close')[0];

// Thêm sự kiện click cho nút đăng nhập
signinButton.addEventListener('click', function() {
    modal.style.display = 'block';
});

// Thêm sự kiện click cho nút đóng modal
span.onclick = function() {
    modal.style.display = 'none';
}

// Thêm sự kiện click bên ngoài modal để đóng modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
