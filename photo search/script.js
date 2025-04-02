const imagesWrapper = document.querySelector(".images");
const fletchMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadImgBtn = lightBox.querySelector(".uil-import");

const apiKey = "0T8E81QLK3JPE2fg4haZdUHc9PxE5cDxn2WzGl50KbFvkSMVgigvm5bO";
const perPage =15;
let currentPage = 1;
let searchPage =1;
let searchTerm =null;

const downloadImg = (imgURL) =>{
    fetch(imgURL).then(res => res.blob()).then(file =>{
       const a= document.createElement("a");
       a.href = URL.createObjectURL(file)
       a.download = new Date().getTime();
       a.click();
    }).catch(() => alert("sorry ..failed to download"))

}

const showLightBox =(name,img) => {

    lightBox.querySelector("img").src=img;
    lightBox.querySelector("span").innerText=name;
    downloadImgBtn.setAttribute("data-img",img);
    lightBox.classList.add("show");
}

const hideLightBox = () => {
    lightBox.classList.remove("show");
}

const generateHTML = (images) => {

    imagesWrapper.innerHTML += images.map(img => `
        <li class="card" onclick="showLightBox('${img.photographer}','${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="Image">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImg('${img.src.large2x}')">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </li>
    `).join(""); 
}

const getImages = (apiURL) => {
    fletchMoreBtn.innerText = "loading....";
    fletchMoreBtn.classList.add("disabled");
    fetch(apiURL, {
        headers:{Authorization: apiKey}
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        fletchMoreBtn.innerText = "load More";
    fletchMoreBtn.classList.remove("disabled");
    }).catch(()=> alert("sorry...failed to load images!"));
}

const fletchMoreImages= () => {
    currentPage ++;
    let apiURL = 'https://api.pexels.com/v1/curated?page=${currentPage}&per_page=15';
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=15` : apiURL;
    getImages(apiURL);
}
const loadSearchImages = (e) => {

    if(e.target.value === "") return searchTerm = null;

    if(e.key === 'Enter') {
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=15`);

    }
}
getImages('https://api.pexels.com/v1/curated?page=${currentPage}&per_page=15');
fletchMoreBtn.addEventListener("click",fletchMoreImages);
searchInput.addEventListener("keyup",loadSearchImages);
closeBtn.addEventListener("click",hideLightBox);
downloadImgBtn.addEventListener("click", (e)  => downloadImg(e.target.dataSet.img));