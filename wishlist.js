// Yuanhan Huang, yh22fv, 7642440

document.addEventListener("DOMContentLoaded", function() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // products.html wishlist
    if (document.querySelectorAll('.data-container .wishlist-icon').length > 0) {
        document.querySelectorAll('.data-container').forEach(function(productCard) {
            const productName = productCard.getAttribute('data-name');
            const wishlistButton = productCard.querySelector('.wishlist-icon');
            const tooltip = wishlistButton.querySelector('.custom-tooltip');

           // tooltip
            if (wishlist.some(item => item.name === productName)) {
                wishlistButton.classList.add('added');
                tooltip.textContent = 'Remove from Wish List';
            } else {
                tooltip.textContent = 'Add to Wish List';
            }

            // adding/removing from wishlist
            wishlistButton.addEventListener('click', function() {
                toggleWishlistOverview(wishlistButton, productCard);
            });
        });
    }

    // single product.html
    const singleProductCard = document.querySelector('.data-container');
    if (singleProductCard) {
        const productName = singleProductCard.getAttribute('data-name');
        const wishlistButton = singleProductCard.querySelector('.wishlist-add');

        if (wishlist.some(item => item.name === productName)) {
            wishlistButton.textContent = 'Remove from Wish List';
            wishlistButton.classList.add('added');
        } else {
            wishlistButton.textContent = 'Add to Wish List';
            wishlistButton.classList.remove('added');
        }

        // adding/removing from wishlist
        wishlistButton.addEventListener('click', function() {
            toggleWishlistSingle(wishlistButton, singleProductCard);
        });
    }

    // toggle add/remove from wishlist in products.html
    function toggleWishlistOverview(element, productCard) {
        const productName = productCard.getAttribute('data-name');
        const productImg = productCard.getAttribute('data-img');
        const productPrice = productCard.getAttribute('data-price');
        const isInWishlist = wishlist.some(item => item.name === productName);
        const tooltip = element.querySelector('.custom-tooltip');

        if (!isInWishlist) {
            wishlist.push({ name: productName, img: productImg, price: productPrice });
            localStorage.setItem('wishlist', JSON.stringify(wishlist));

            element.classList.add('added');
            tooltip.textContent = 'Remove from Wish List'; 
            showWishlistPopup({ name: productName, img: productImg, price: productPrice, action: 'added' });
        } else {
            wishlist = wishlist.filter(item => item.name !== productName);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));

            element.classList.remove('added');
            tooltip.textContent = 'Add to Wish List';
            showWishlistPopup({ name: productName, img: productImg, price: productPrice, action: 'removed' });
        }
    }

    // toggle add/remove from wishlist in single product.html
    function toggleWishlistSingle() {
        const productCard = document.querySelector('.data-container');
        const productName = productCard.getAttribute('data-name');
        const productImg = productCard.getAttribute('data-img');
        const productPrice = productCard.getAttribute('data-price');
    
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const wishlistButton = document.querySelector('.wishlist-add');
        const isInWishlist = wishlist.some(item => item.name === productName);
    
        if (!isInWishlist) {
            wishlist.push({ name: productName, img: productImg, price: productPrice });
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
            wishlistButton.textContent = 'Remove from Wish List';
            wishlistButton.classList.add('added');
            showWishlistPopup({ name: productName, img: productImg, price: productPrice, action: 'added' });
        } else {
            wishlist = wishlist.filter(item => item.name !== productName);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
            wishlistButton.textContent = 'Add to Wish List';
            wishlistButton.classList.remove('added');
            showWishlistPopup({ name: productName, img: productImg, price: productPrice, action: 'removed' });
        }
    }
    

    // show the wishlist pop-up window
    function showWishlistPopup(product) {
        const popup = document.getElementById('wishlist-popup');
        const popupContent = document.getElementById('wishlist-popup-content');
        let actionText = product.action === 'added' ? 'Added to your wishlist!' : 'Successfully removed from your wishlist!';

        if (popup && product) {
            popupContent.innerHTML = `
                <img src="${product.img}" alt="${product.name}" style="width: 150px; height: auto; margin-bottom: 10px;"/>
                <h4>${product.name}</h4>
                <h5>${actionText}</h5>
                <button id="view-wishlist" class="wishlist-link">View Wish List</button>
                <button id="close-popup" class="wishlist-close">Close</button>
            `;

            popup.style.display = 'block';

            document.getElementById('view-wishlist').addEventListener('click', function() {
                window.location.href = 'wishlist.html';
            });

            document.getElementById('close-popup').addEventListener('click', function() {
                popup.style.display = 'none';
            });
        }
    }

    // update wishlist.html
    function updateWishlistPage() {
        const wishlistItemsPage = document.getElementById('wishlist-items-page');
        if (wishlistItemsPage) {
            wishlistItemsPage.innerHTML = "";

            wishlist.forEach(function(product) {
                const listItem = document.createElement('div');
                listItem.className = 'wishlist-item';

                const imgElement = document.createElement('img');
                imgElement.src = product.img;
                imgElement.alt = product.name;
                imgElement.className = 'wishlist-item-img';
                listItem.appendChild(imgElement);

                const detailsDiv = document.createElement('div');
                detailsDiv.className = 'wishlist-item-details';
                
                const titleElement = document.createElement('div');
                titleElement.className = 'wishlist-item-title';
                titleElement.textContent = product.name;
                detailsDiv.appendChild(titleElement);
                
                const priceElement = document.createElement('div');
                priceElement.className = 'wishlist-item-price';
                priceElement.textContent = product.price;
                detailsDiv.appendChild(priceElement);

                listItem.appendChild(detailsDiv);

                const removeButton = document.createElement('button');
                removeButton.className = 'remove-button';
                removeButton.innerHTML = '✗';

                removeButton.addEventListener('click', function() {
                    removeFromWishlist(product.name, product.img);
                });

                listItem.appendChild(removeButton);
                wishlistItemsPage.appendChild(listItem);
            });
        }
    }

    // Show pop-up window after removing an item from wishlist
    function showRemovalPopup(productName, productImg) {
        const popup = document.getElementById('wishlist-popup');
        const popupContent = document.getElementById('wishlist-popup-content');
    
        popupContent.innerHTML = `
            <img src="${productImg}" alt="${productName}" style="width: 150px; height: auto; margin-bottom: 10px;"/>
            <h4>${productName}</h4>
            <h5>Successfullys removed from your wishlist!</h5>
            <button id="back-to-products" class="wishlist-link">Back Products</button>
            <button id="close-popup" class="wishlist-close">Close</button>
        `;
    
        popup.style.display = 'block';
    
        document.getElementById('back-to-products').addEventListener('click', function() {
            window.location.href = 'products.html';
        });
    
        document.getElementById('close-popup').addEventListener('click', function() {
            popup.style.display = 'none';
        });
    }
    
    // remove a product from wishlist
    function removeFromWishlist(productName, productImg) {
        wishlist = wishlist.filter(item => item.name !== productName);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistPage();
        showRemovalPopup(productName, productImg);
    }

    // initial update of wishlist
    updateWishlistPage();
});
