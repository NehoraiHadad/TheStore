const left = document.getElementsByClassName("left-main")[0];
const right = document.getElementsByClassName("right-main")[0];
const container = document.getElementsByTagName("main")[0];

const tableRowProduct = document.getElementsByClassName("table-row-product");
const categorySelect = document.getElementsByClassName("categorySelect")[0];
const categoryInput = document.getElementsByClassName("categoryInput")[0];


left.addEventListener("mouseenter", () => {
  container.classList.add("hover-left");
});

left.addEventListener("mouseleave", () => {
  container.classList.remove("hover-left");
});

right.addEventListener("mouseenter", () => {
  container.classList.add("hover-right");
});

right.addEventListener("mouseleave", () => {
  container.classList.remove("hover-right");
});

if (document.title == "Management") {
   categorySelect.addEventListener('change', (event) => {
     if (event.target.value == 'הוסף קטגוריה') {
       categoryInput.value = '';
     } else{
       categoryInput.value = event.target.value.slice(0,-1);
     }
   });
 }

function searchRelevant(){
  if (document.title != 'Management Products' && document.title !=  "Management Users") {
    document.getElementsByClassName('search-bar')[0].disabled = true;
  } 
}
searchRelevant();