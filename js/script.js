const loadHeader = () => {
    fetch('https://openapi.programming-hero.com/api/news/categories')
        .then(res => res.json())
        .then(data => displayLoadHeader(data.data.news_category))
        .catch(error => alert(error));
}
const displayLoadHeader = (categories) => {
    const categoriesNav = document.getElementById('header-ul');
    categories.forEach(category => {
        const categoryLi = document.createElement('li');
        categoryLi.classList.add('d-inline-block');
        categoryLi.innerHTML = `     
            <button onclick='loadCategoryItem("${category.category_id}", "${category.category_name}")' class="border-none px-4 bg-light">
            ${category.category_name}</button>       
        `;
        categoriesNav.appendChild(categoryLi);
    })
}

loadHeader();

// load news
const loadCategoryItem = async (category_id, category_name) => {
    toggleSpinner(true);
    const categoryUrl = `https://openapi.programming-hero.com/api/news/category/${category_id}`;

    // fetch(categoryUrl)
    // .then(res => res.json())
    // .then(data => displayCategoryItems(data))

    const res = await fetch(categoryUrl);
    const data = await res.json();
    try {
        if (data == "") throw "empty";
    } catch (err) {
        alert("error");
    }
    displayCategoryItems(data.data);

    const itemNumber = parseInt(data.data.length);
    // console.log(itemNumber)
    if (itemNumber !== 0) {
        const itemContainer = document.getElementById("total-items");
        itemContainer.innerHTML = "";
        const div = document.createElement("div");
        div.innerHTML = `

        <h3>${itemNumber} news found for ${category_name}</h3>`;

        itemContainer.appendChild(div);

    } else {
        const itemContainer = document.getElementById("total-items");
        itemContainer.innerHTML = "";
        const div = document.createElement("div");
        div.innerHTML = `
        <h3>No news found for ${category_name}</h3>`;

        itemContainer.appendChild(div);
    }
    // displayCategoryItems(data.data);
};


// display news
const displayCategoryItems = (elements) => {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';

    elements.sort((a, b) => {
        return b.total_view - a.total_view;            
    });

    elements.forEach((element) => {
        

        const newsDiv = document.createElement('div');
        newsDiv.classList.add('row', 'shadow', 'mb-5', 'pb-2');

        let views = element.total_view;
        // console.log(views);
       
        

        newsDiv.innerHTML = `
<div class="col-sm-12 col-md-4">
    <img src="${element.image_url ? element.image_url : 'no image found'}" alt="" class="img-fluid">
</div>
<div class="col-sm-12 col-md-8">
    <div class="row">
        <div class="col-sm-12">
            <h4> ${element.title ? element.title : 'no title found'}</h4>
            <p>${element.details ? element.details.split(" ", 100).join(' ') : 'no details found'}...</p>
        </div> 
        <div class="col-sm-12">
            <div class="row d-flex justify-content-between">
                <div class="col-sm-6 col-md-6 d-flex">
                    <div>
                        <img src="${element.author.img ? element.author.img : 'no author image found'}" class="img-fluid author-img" alt="">
                        <h6 class="d-inline-block ms-2 mb-0 pb-0">${element.author.name ? element.author.name : 'no author name found'}</h6>
                        <p class="ms-5 news-date">${element.author.published_date ? element.author.published_date : 'no published found'}</p>
                    </div>                                   
                </div>
                <div class="col-sm-6 col-md-3">
                    <i class="fa fa-eye" aria-hidden="true"></i>
                    <h6 class = "d-inline-block">${views ? views : 'no data found'}</h6>
                </div>
                <div class="col-sm-6 col-md-3">
                    <button onclick = 'showDetails("${element._id}")' class='btn btn-primary' data-bs-toggle='modal' data-bs-target='#newsModal'>View Details</button>
                </div>
            </div>
        </div>
    </div>
</div>
    `;
        newsContainer.appendChild(newsDiv);
    })
    toggleSpinner(false);
};

// spinner
const toggleSpinner = (isLoading) => {
    const spinner = document.getElementById("spinner");
    if (isLoading) {
        spinner.classList.remove("d-none");
    } else {
        spinner.classList.add("d-none");
    }
};

// modal
const showDetails = async (news_id) => {
    const detailsUrl = `https://openapi.programming-hero.com/api/news/${news_id}`;
    const res = await fetch(detailsUrl);
    const data = await res.json();
    try {
        if (data == "") throw "empty";
    } catch (err) {
        alert("error");
    }
    const details = data.data;
    // console.log(data.data[0])
    const modalContainer = document.getElementById("modal-div");
    modalContainer.innerHTML = "";

    details.forEach((element) => {
        // console.log(element)
        const modal = document.createElement('div');
        modal.classList.add('modal-content');
        modal.innerHTML = `
        <div class="modal-header">
            <img src="${element.author.img ? element.author.img : 'no author image found'}" class="modal-title img-fluid author-img" id="newsModalLabel" alt="">
            <h6>${element.title ? element.title : 'no title found'}</h6>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-5">           
                <p><strong>Name:</strong> ${element.author.name ? element.author.name  : 'Author name not found'}</p>
                <p><strong>Published Date:</strong> ${element.author.published_date ? element.author.published_date : 'Published date not found'}</p>
                <p><strong>Views:</strong> ${element.total_view ? element.total_view : 'views data not found'}</p>
                <p><strong>Details:</strong> ${element.details ? element.details : 'No details found'}</p>
                <p><strong>Rating:</strong> ${element.rating.badge ? element.rating.badge : 'rating not found'} , 
                ${element.rating.number ? element.rating.number : 'rating not found'}</p>
                <p><strong>Post Id:</strong>  ${element._id ? element._id  : 'post id not found'}</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

        </div>
        `;
        modalContainer.appendChild(modal);
    })

};

